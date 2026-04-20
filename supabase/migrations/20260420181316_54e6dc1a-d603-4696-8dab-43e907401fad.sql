-- Subscriptions table for Paddle
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  paddle_subscription_id text not null unique,
  paddle_customer_id text not null,
  product_id text not null,
  price_id text not null,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  environment text not null default 'sandbox',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, environment)
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_paddle_id on public.subscriptions(paddle_subscription_id);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

-- One-time purchases table (for Lifetime)
create table public.lifetime_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  paddle_transaction_id text not null unique,
  paddle_customer_id text not null,
  product_id text not null,
  price_id text not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  environment text not null default 'sandbox',
  purchased_at timestamptz default now()
);

create index idx_lifetime_user_id on public.lifetime_purchases(user_id);

alter table public.lifetime_purchases enable row level security;

create policy "Users can view own lifetime"
  on public.lifetime_purchases for select
  using (auth.uid() = user_id);

create policy "Service role can manage lifetime"
  on public.lifetime_purchases for all
  using (auth.role() = 'service_role');

-- Active access helper (subscription OR lifetime)
create or replace function public.has_active_subscription(
  user_uuid uuid,
  check_env text default 'live'
)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = user_uuid
    and environment = check_env
    and status in ('active', 'trialing')
    and (current_period_end is null or current_period_end > now())
  ) or exists (
    select 1 from public.lifetime_purchases
    where user_id = user_uuid
    and environment = check_env
  );
$$;

-- Trigger to flip profiles.is_premium when subscription/lifetime changes
create or replace function public.sync_premium_status()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  target_user uuid;
begin
  target_user := coalesce(NEW.user_id, OLD.user_id);
  update public.profiles
    set is_premium = public.has_active_subscription(target_user, 'live')
                  or public.has_active_subscription(target_user, 'sandbox'),
        updated_at = now()
    where user_id = target_user;
  return NEW;
end;
$$;

create trigger trg_sync_premium_subs
  after insert or update or delete on public.subscriptions
  for each row execute function public.sync_premium_status();

create trigger trg_sync_premium_lifetime
  after insert or update or delete on public.lifetime_purchases
  for each row execute function public.sync_premium_status();
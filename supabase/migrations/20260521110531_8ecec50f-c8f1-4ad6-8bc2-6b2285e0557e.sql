-- Phase 10: Friends & accountability (opt-in)
-- Stores pairwise friendships with invite/accept flow. A friendship row is
-- created by the inviter and then accepted (or declined) by the invitee.

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  -- The inviter (always the row owner)
  user_id uuid not null,
  -- The invited user (null until the email is matched to an account)
  friend_user_id uuid,
  -- Optional invite-by-email when the friend isn't on the platform yet
  invited_email text,
  -- pending | accepted | declined
  status text not null default 'pending',
  -- Whether the inviter has opted in to share their streak with the friend
  share_streak boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_status_chk check (status in ('pending','accepted','declined'))
);

create index idx_friendships_user_id on public.friendships(user_id);
create index idx_friendships_friend_user_id on public.friendships(friend_user_id);
create index idx_friendships_invited_email on public.friendships(invited_email);

alter table public.friendships enable row level security;

-- Owner can read their outgoing invites
create policy "Inviter can view own friendships"
  on public.friendships for select
  to authenticated
  using (auth.uid() = user_id);

-- Invitee (once matched) can read incoming invites
create policy "Invitee can view incoming friendships"
  on public.friendships for select
  to authenticated
  using (auth.uid() = friend_user_id);

-- Inviter creates the row
create policy "Inviter can insert friendships"
  on public.friendships for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Inviter can edit / cancel their own row (e.g. toggle share_streak, delete)
create policy "Inviter can update own friendships"
  on public.friendships for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Inviter can delete own friendships"
  on public.friendships for delete
  to authenticated
  using (auth.uid() = user_id);

-- Invitee can accept / decline (only flips status; share_streak stays inviter-controlled)
create policy "Invitee can update incoming status"
  on public.friendships for update
  to authenticated
  using (auth.uid() = friend_user_id)
  with check (auth.uid() = friend_user_id);

create trigger update_friendships_updated_at
before update on public.friendships
for each row execute function public.update_updated_at_column();

-- Helper: read a friend's public stats (display name, streak, total minutes)
-- without leaking the underlying tables. SECURITY DEFINER + strict checks
-- ensure callers only see stats for accepted, opted-in friendships.
create or replace function public.get_friend_stats(_friend_user_id uuid)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  streak_days integer,
  total_minutes integer,
  last_session_date date
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and f.share_streak = true
      and (
        (f.user_id = auth.uid()    and f.friend_user_id = _friend_user_id)
        or
        (f.friend_user_id = auth.uid() and f.user_id = _friend_user_id)
      )
  ) then
    return;
  end if;

  return query
    select
      p.user_id,
      p.display_name,
      p.avatar_url,
      coalesce(up.streak_days, 0),
      coalesce(up.total_minutes, 0),
      up.last_session_date
    from public.profiles p
    left join public.user_progress up on up.user_id = p.user_id
    where p.user_id = _friend_user_id;
end;
$$;
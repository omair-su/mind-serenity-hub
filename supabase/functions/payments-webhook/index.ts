import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWebhook, getPaddleClient, EventName, type PaddleEnv } from '../_shared/paddle.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const LIFETIME_PRICE_ID = 'willow_lifetime_onetime';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as PaddleEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log('Received event:', event.eventType, 'env:', env);

    switch (event.eventType) {
      case EventName.SubscriptionCreated:
        await handleSubscriptionCreated(event.data, env);
        break;
      case EventName.SubscriptionUpdated:
        await handleSubscriptionUpdated(event.data, env);
        break;
      case EventName.SubscriptionCanceled:
        await handleSubscriptionCanceled(event.data, env);
        break;
      case EventName.TransactionCompleted:
        await handleTransactionCompleted(event.data, env);
        break;
      case EventName.TransactionPaymentFailed:
        console.log('Payment failed:', event.data.id, 'env:', env);
        break;
      default:
        console.log('Unhandled event:', event.eventType);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Webhook error', { status: 400 });
  }
});

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const { id, customerId, items, status, currentBillingPeriod, customData } = data;
  const userId = customData?.userId;
  if (!userId) {
    console.error('No userId in customData on subscription.created');
    return;
  }

  const item = items[0];
  const priceId = item.price.importMeta?.externalId || item.price.id;
  const productId = item.product?.importMeta?.externalId || item.price.productId;

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    paddle_subscription_id: id,
    paddle_customer_id: customerId,
    product_id: productId,
    price_id: priceId,
    status,
    current_period_start: currentBillingPeriod?.startsAt,
    current_period_end: currentBillingPeriod?.endsAt,
    environment: env,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,environment' });
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  const { id, status, currentBillingPeriod, scheduledChange } = data;
  await supabase.from('subscriptions')
    .update({
      status,
      current_period_start: currentBillingPeriod?.startsAt,
      current_period_end: currentBillingPeriod?.endsAt,
      cancel_at_period_end: scheduledChange?.action === 'cancel',
      updated_at: new Date().toISOString(),
    })
    .eq('paddle_subscription_id', id)
    .eq('environment', env);
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  await supabase.from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('paddle_subscription_id', data.id)
    .eq('environment', env);
}

async function handleTransactionCompleted(data: any, env: PaddleEnv) {
  const { id, customerId, items, customData, details } = data;
  const userId = customData?.userId;
  const item = items?.[0];
  const priceExternalId = item?.price?.importMeta?.externalId;

  // Lifetime one-time purchase
  if (userId && priceExternalId === LIFETIME_PRICE_ID) {
    const amount = parseInt(details?.totals?.total || item?.price?.unitPrice?.amount || '19900', 10);
    await supabase.from('lifetime_purchases').upsert({
      user_id: userId,
      paddle_transaction_id: id,
      paddle_customer_id: customerId,
      product_id: item.product?.importMeta?.externalId || item.price.productId,
      price_id: priceExternalId,
      amount_cents: amount,
      currency: details?.totals?.currencyCode?.toLowerCase() || 'usd',
      environment: env,
    }, { onConflict: 'user_id' });

    // Auto-cancel any active subscription (lifetime always wins)
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('paddle_subscription_id')
      .eq('user_id', userId)
      .eq('environment', env)
      .in('status', ['active', 'trialing', 'past_due'])
      .maybeSingle();

    if (existingSub?.paddle_subscription_id) {
      try {
        const paddle = getPaddleClient(env);
        await paddle.subscriptions.cancel(existingSub.paddle_subscription_id, {
          effectiveFrom: 'next_billing_period',
        });
        console.log('Auto-canceled subscription after lifetime purchase:', existingSub.paddle_subscription_id);
      } catch (err) {
        console.error('Failed to auto-cancel subscription:', err);
      }
    }
  }

  console.log('Transaction completed:', id, 'env:', env);
}

/**
 * Fulfilment lives here, not on the confirmation page. A buyer can pay and
 * lose their connection before /order/confirmed loads, so the only reliable
 * signal that money arrived is Stripe telling us directly.
 *
 * Every event is signature-checked with STRIPE_WEBHOOK_SECRET before it is
 * trusted. A paid session is written to the site's Netlify Blobs store
 * (`orders`, one JSON record per session — visible in Netlify → Blobs) and,
 * when RESEND_API_KEY + ORDER_NOTIFY_EMAIL are set, the atelier is emailed.
 *
 * Dashboard → Developers → Webhooks → Add endpoint:
 *   https://afrinoble.netlify.app/.netlify/functions/stripe-webhook
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded,
 *         checkout.session.async_payment_failed
 */
import Stripe from 'stripe';
import { getStore } from '@netlify/blobs';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const SIGNING_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const reply = (status, body) => ({ statusCode: status, body: typeof body === 'string' ? body : JSON.stringify(body) });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, 'method not allowed');
  if (!stripe || !SIGNING_SECRET) return reply(503, 'webhook not configured');

  // Netlify hands us the raw body, which is what the signature covers.
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(raw, event.headers['stripe-signature'], SIGNING_SECRET);
  } catch (err) {
    console.warn('webhook signature rejected:', err.message);
    return reply(400, 'bad signature');
  }

  const session = stripeEvent.data.object;
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      // With delayed payment methods `completed` can arrive while still
      // unpaid; fulfil only once the money is actually there.
      if (session.payment_status !== 'unpaid') await fulfil(session, stripeEvent.type);
      break;
    case 'checkout.session.async_payment_failed':
      await record(session, 'payment_failed');
      await notify(session, 'payment_failed');
      break;
    default:
      break;
  }
  return reply(200, { received: true });
};

async function fulfil(session, eventType) {
  const order = await record(session, 'paid', eventType);
  await notify(order, 'paid');
}

/** One durable record per Checkout Session; a redelivered event just rewrites it. */
async function record(session, status, eventType) {
  const order = {
    id: session.id,
    status,
    event: eventType ?? null,
    brand: session.metadata?.brand ?? 'Afrinoble',
    product: session.metadata?.product ?? null,
    slug: session.metadata?.slug ?? null,
    size: session.metadata?.size || null,
    amountTotal: session.amount_total,
    currency: session.currency,
    customer: {
      name: session.customer_details?.name ?? null,
      email: session.customer_details?.email ?? null,
      phone: session.customer_details?.phone ?? null,
    },
    shipping: session.shipping_details?.address ?? session.customer_details?.address ?? null,
    paymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    createdAt: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
    recordedAt: new Date().toISOString(),
  };
  try {
    await getStore('orders').setJSON(session.id, order);
  } catch (err) {
    // Never fail the webhook over storage: Stripe would retry and the
    // notification below still goes out. The dashboard remains the ledger.
    console.error('order record failed', err);
  }
  return order;
}

/** Emails the atelier through Resend when configured; otherwise a no-op. */
async function notify(order, status) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!key || !to) return;
  const from = process.env.ORDER_FROM_EMAIL || 'Afrinoble orders <onboarding@resend.dev>';
  const money = (n, c) => new Intl.NumberFormat('en-US', { style: 'currency', currency: (c || 'usd').toUpperCase() }).format((n ?? 0) / 100);
  const ship = order.shipping ? [order.shipping.line1, order.shipping.line2, order.shipping.city, order.shipping.state, order.shipping.postal_code, order.shipping.country].filter(Boolean).join(', ') : '—';
  const subject = status === 'paid'
    ? `New Afrinoble order · ${order.product ?? 'piece'}${order.size ? ` · size ${order.size}` : ''} · ${money(order.amountTotal, order.currency)}`
    : `Afrinoble payment failed · ${order.product ?? 'piece'}`;
  const text = [
    status === 'paid' ? 'A new order has been paid.' : 'A payment for this order failed after checkout; nothing to ship.',
    '',
    `Piece: ${order.product ?? '—'}${order.size ? ` (size ${order.size})` : ''}`,
    `Amount: ${money(order.amountTotal, order.currency)}`,
    `Customer: ${order.customer?.name ?? '—'} · ${order.customer?.email ?? '—'} · ${order.customer?.phone ?? '—'}`,
    `Ship to: ${ship}`,
    `Stripe session: ${order.id}`,
    order.paymentIntent ? `Payment: https://dashboard.stripe.com/payments/${order.paymentIntent}` : null,
  ].filter((l) => l !== null).join('\n');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) console.error('order email failed', res.status, await res.text());
  } catch (err) {
    console.error('order email failed', err);
  }
}

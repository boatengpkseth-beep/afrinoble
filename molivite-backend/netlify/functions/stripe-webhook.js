/**
 * POST /stripe-webhook
 *
 * Stripe calls this directly (never the browser, so no CORS headers). Every
 * event is signature-checked against STRIPE_WEBHOOK_SECRET on the RAW body
 * before anything is trusted. This is the reliable source of truth for a
 * paid order — the confirmation page is only a courtesy.
 *
 * Dashboard → Developers → Webhooks → Add endpoint
 *   URL:    https://<site>.netlify.app/stripe-webhook
 *   Events: checkout.session.completed
 *           checkout.session.async_payment_succeeded
 *           checkout.session.async_payment_failed
 *           checkout.session.expired
 */
import { stripe, requireEnv, json } from '../lib/http.js';

const SIGNING_SECRET = requireEnv('STRIPE_WEBHOOK_SECRET');

/** What one order looks like in the log and, later, in the order system. */
function orderRecord(session) {
  return {
    sessionId: session.id,
    email: session.customer_details?.email ?? null,
    amountTotal: session.amount_total ?? null, // cents
    currency: session.currency ?? null,
    quantity: Number(session.metadata?.quantity) || null,
    productId: session.metadata?.product_id ?? null,
    paymentStatus: session.payment_status,
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method-not-allowed' }, { Allow: 'POST' });

  // Netlify may hand the body base64-encoded; the signature covers the raw bytes.
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf8') : event.body ?? '';
  const signature = event.headers?.['stripe-signature'] ?? event.headers?.['Stripe-Signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, SIGNING_SECRET);
  } catch (err) {
    console.warn('stripe-webhook: signature rejected:', err?.message ?? err);
    return json(400, { error: 'invalid-signature' });
  }

  const session = stripeEvent.data.object;

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      // With delayed payment methods (bank debits etc.) `completed` can
      // arrive while payment_status is still 'unpaid'; the money is confirmed
      // by the later async_payment_succeeded event. Fulfil only when paid.
      if (session.payment_status === 'paid') {
        console.log('ORDER PAID', JSON.stringify(orderRecord(session)));
        await fulfil(session);
      } else {
        console.log('ORDER PENDING (awaiting payment)', JSON.stringify(orderRecord(session)));
      }
      break;
    case 'checkout.session.async_payment_failed':
      console.log('PAYMENT FAILED', JSON.stringify(orderRecord(session)));
      break;
    case 'checkout.session.expired':
      console.log('CHECKOUT EXPIRED', JSON.stringify({ sessionId: session.id, email: session.customer_details?.email ?? null }));
      break;
    default:
      // Not subscribed to anything else; acknowledge so Stripe stops retrying.
      break;
  }

  return json(200, { received: true });
};

/**
 * ---------------------------------------------------------------------------
 * FULFILMENT — add order handling here.
 *
 * `session` is a paid Checkout Session. Useful fields:
 *   session.id                      unique order reference (use it as the
 *                                   idempotency key: Stripe can deliver the
 *                                   same event more than once)
 *   session.customer_details.email  buyer's email
 *   session.customer_details.name   buyer's name
 *   session.shipping_details        name + address to ship to
 *   session.amount_total            cents
 *   session.metadata.quantity       bottles ordered
 *
 * Examples of what goes here:
 *   - POST the order to your order system / 3PL / Printful, keyed by session.id
 *   - send a confirmation email via Resend, Postmark or SendGrid
 *   - append a row to a Google Sheet or Airtable
 *
 * Keep it fast (Stripe waits ~10 s) and idempotent. If it throws, return a
 * non-2xx so Stripe retries — the log line above is already written.
 * ---------------------------------------------------------------------------
 */
async function fulfil(session) {
  void session; // nothing wired yet — see the block above
}

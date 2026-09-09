/**
 * Tells the confirmation page whether a Checkout Session actually paid.
 * Returns only what the page needs to say thank you — never card details.
 */
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (!stripe) return json(503, { error: 'not_configured' });
  const id = event.queryStringParameters?.session_id;
  if (!id || !/^cs_[A-Za-z0-9_]+$/.test(id)) return json(400, { error: 'bad_session' });
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    return json(200, {
      status: session.status, // open | complete | expired
      paymentStatus: session.payment_status, // paid | unpaid | no_payment_required
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
      product: session.metadata?.product ?? null,
      size: session.metadata?.size || null,
    });
  } catch (err) {
    console.error('session status failed', err);
    return json(404, { error: 'not_found' });
  }
};

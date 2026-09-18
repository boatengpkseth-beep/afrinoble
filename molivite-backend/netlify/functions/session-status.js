/**
 * GET /session-status?session_id=cs_...
 *
 * Tells the confirmation page whether a Checkout Session paid. Returns only
 * what the page needs to say thank you — never card or address details.
 * The webhook, not this endpoint, is the record of a paid order: a buyer can
 * close the tab before this page loads.
 */
import { stripe, corsHeaders, originOf, json, preflight, methodNotAllowed } from '../lib/http.js';

const SESSION_ID = /^cs_(live|test)_[A-Za-z0-9]+$/;

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight(event);
  if (event.httpMethod !== 'GET') return methodNotAllowed(event, 'GET, OPTIONS');
  const cors = corsHeaders(originOf(event));

  const id = event.queryStringParameters?.session_id;
  if (!id) return json(400, { error: 'missing-session-id' }, cors);
  if (!SESSION_ID.test(id)) return json(400, { error: 'invalid-session-id' }, cors);

  try {
    const session = await stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] });
    const lines = session.line_items?.data ?? [];
    const quantity = lines.length ? lines.reduce((sum, line) => sum + (line.quantity ?? 0), 0) : null;
    return json(
      200,
      {
        status: session.status, // 'open' | 'complete' | 'expired'
        paid: session.payment_status === 'paid',
        email: session.customer_details?.email ?? null,
        amountTotal: session.amount_total ?? null, // cents
        quantity,
      },
      cors,
    );
  } catch (err) {
    console.error('session-status failed:', err?.type ?? 'error', err?.code ?? '', err?.message ?? err);
    return json(500, { error: 'session-status-failed' }, cors);
  }
};

/**
 * Exercises every code path that does not call Stripe: CORS preflight,
 * method rejection, input validation, webhook signature rejection.
 * Run with `npm test`. Uses placeholder secrets that never reach Stripe.
 */
import assert from 'node:assert/strict';

process.env.STRIPE_SECRET_KEY ||= 'sk_test_placeholder_for_smoke_test_only';
process.env.STRIPE_WEBHOOK_SECRET ||= 'whsec_placeholder_for_smoke_test_only';

const { handler: create } = await import('../netlify/functions/create-checkout-session.js');
const { handler: status } = await import('../netlify/functions/session-status.js');
const { handler: webhook } = await import('../netlify/functions/stripe-webhook.js');

const origin = 'https://molivite.com';
const req = (httpMethod, extra = {}) => ({ httpMethod, headers: { origin }, ...extra });

// CORS preflight
for (const fn of [create, status]) {
  const res = await fn(req('OPTIONS'));
  assert.equal(res.statusCode, 204);
  assert.equal(res.headers['Access-Control-Allow-Origin'], origin);
  assert.equal(res.headers['Access-Control-Allow-Methods'], 'POST, GET, OPTIONS');
  assert.equal(res.headers['Access-Control-Allow-Headers'], 'Content-Type');
}
// Localhost is allowed for netlify dev; unknown origins get the canonical one back.
assert.equal((await create(req('OPTIONS', { headers: { origin: 'http://localhost:8888' } }))).headers['Access-Control-Allow-Origin'], 'http://localhost:8888');
assert.equal((await create(req('OPTIONS', { headers: { origin: 'https://evil.example' } }))).headers['Access-Control-Allow-Origin'], origin);

// Wrong methods
assert.equal((await create(req('GET'))).statusCode, 405);
assert.equal((await status(req('POST'))).statusCode, 405);
assert.equal((await webhook(req('GET'))).statusCode, 405);
assert.equal((await webhook(req('GET'))).headers['Access-Control-Allow-Origin'], undefined, 'webhook must not send CORS');

// Bad input
assert.equal((await create(req('POST', { body: '{not json' }))).statusCode, 400);
assert.deepEqual(JSON.parse((await status(req('GET', { queryStringParameters: {} }))).body), { error: 'missing-session-id' });
assert.deepEqual(JSON.parse((await status(req('GET', { queryStringParameters: { session_id: 'nope' } }))).body), { error: 'invalid-session-id' });

// Webhook: unsigned / badly signed payloads are rejected before parsing
const bad = await webhook({ httpMethod: 'POST', headers: { 'stripe-signature': 't=1,v1=deadbeef' }, body: '{}' });
assert.equal(bad.statusCode, 400);
assert.deepEqual(JSON.parse(bad.body), { error: 'invalid-signature' });

console.log('smoke: all checks passed');

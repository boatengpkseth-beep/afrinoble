/**
 * The partner programme's rules, run against an in-memory store:
 * applications, approval and unique codes, clicks, commission, self-purchase,
 * duplicate webhooks, paused partners, payouts, voided sales and key checks.
 */
import assert from 'node:assert/strict';

const lib = await import('../netlify/lib/affiliates.js');
const { default: handler } = await import('../netlify/functions/affiliate.js');

const data = new Map();
lib.useStoreForTests({
  get: async (key) => (data.has(key) ? JSON.parse(data.get(key)) : null),
  setJSON: async (key, value) => void data.set(key, JSON.stringify(value)),
  list: async ({ prefix }) => ({ blobs: [...data.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }),
});

const origin = 'https://www.molivite.com';
const call = async (route, { method = 'POST', body, auth, query } = {}) => {
  const url = new URL(`https://molivite-checkout.netlify.app/affiliate/${route}`);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);
  const res = await handler(
    new Request(url, {
      method,
      headers: { origin, ...(auth ? { authorization: `Bearer ${auth}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  );
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null, headers: Object.fromEntries([...res.headers].map(([k, v]) => [k.toLowerCase(), v])) };
};
const session = (id, code, extra = {}) => ({
  id,
  metadata: { affiliate: code, product_id: 'molivite-3-month', quantity: '1' },
  amount_subtotal: 9447,
  amount_total: 9447,
  customer_details: { email: 'buyer@example.com' },
  ...extra,
});

// CORS lets the admin page send its key
const pre = await call('admin', { method: 'OPTIONS' });
assert.equal(pre.status, 204);
assert.match(pre.headers['access-control-allow-headers'], /Authorization/);

// Admin is closed until a key exists, then needs the right one
delete process.env.AFFILIATE_ADMIN_KEY;
assert.equal((await call('admin', { body: { action: 'overview' } })).status, 503);
process.env.AFFILIATE_ADMIN_KEY = 'correct-horse-battery-staple';
assert.equal((await call('admin', { body: { action: 'overview' } })).status, 401);
assert.equal((await call('admin', { body: { action: 'overview' }, auth: 'wrong' })).status, 401);
const ADMIN = process.env.AFFILIATE_ADMIN_KEY;
const adminCall = (body) => call('admin', { body, auth: ADMIN });

// Applications: bad ones refused, the honeypot stores nothing
assert.equal((await call('apply', { body: { name: 'No Email' } })).status, 400);
assert.equal((await call('apply', { body: { name: 'Bot', email: 'bot@example.com', 'company-website': 'http://spam' } })).status, 200);
assert.equal((await call('apply', { body: { name: 'Ama Mensah', email: 'Ama@Example.com', 'preferred-code': 'Ama', channels: '@ama' } })).status, 200);
let view = (await adminCall({ action: 'overview' })).body;
assert.equal(view.applications.length, 1);
assert.equal(view.applications[0].email, 'ama@example.com');

// Approval: needs a sensible rate, hands back the public and private links
const appId = view.applications[0].id;
assert.equal((await adminCall({ action: 'approve', appId, ratePercent: 0 })).body.error, 'rate-must-be-1-to-60-percent');
assert.equal((await adminCall({ action: 'approve', appId, tier: 'platinum' })).body.error, 'unknown-tier');
assert.equal((await adminCall({ action: 'approve', appId, tier: 'ambassador' })).body.error, 'rate-must-be-1-to-60-percent', 'an ambassador rate is always entered by hand');
const approved = (await adminCall({ action: 'approve', appId, tier: 'standard' })).body;
assert.equal(approved.partner.code, 'ama');
assert.equal(approved.partner.tier, 'standard');
assert.equal(approved.partner.rate, 0.15, 'a tier brings its usual rate');
assert.equal(approved.link, 'https://www.molivite.com/?ref=ama');
const key = approved.dashboardLink.split('#')[1];
assert.ok(key.length >= 20);
assert.ok(!JSON.stringify([...data.values()]).includes(key), 'the private key itself is never stored');
assert.equal((await adminCall({ action: 'approve', appId, ratePercent: 15 })).body.error, 'application-not-found');

// Codes are unique: a taken code is refused, an automatic one gets a number
assert.equal((await adminCall({ action: 'approve', name: 'Other Ama', email: 'o@example.com', code: 'ama', ratePercent: 10 })).body.error, 'code-taken');
await call('apply', { body: { name: 'Ama Two', email: 'ama2@example.com', 'preferred-code': 'ama' } });
view = (await adminCall({ action: 'overview' })).body;
const second = (await adminCall({ action: 'approve', appId: view.applications[0].id, tier: 'creator', ratePercent: 22 })).body;
assert.equal(second.partner.code, 'ama2');
assert.equal(second.partner.rate, 0.22, 'a rate entered by hand wins over the tier');

// Clicks count only for real, active partners
await call('click', { body: { code: 'AMA' } });
await call('click', { body: { code: 'nobody' } });
await call('click', { body: { code: '<script>' } });

// Sales: commission on goods value, once per order
assert.equal(await lib.recordSale({}, session('cs_test_1', 'ama')), 'recorded');
assert.equal(await lib.recordSale({}, session('cs_test_1', 'ama')), 'already-recorded');
assert.equal(await lib.recordSale({}, session('cs_test_2', 'ama', { amount_subtotal: 3499, total_details: { amount_discount: 499 } })), 'recorded');
assert.equal(await lib.recordSale({}, session('cs_test_3', 'ama', { customer_details: { email: 'AMA@example.com' } })), 'own-purchase');
assert.equal(await lib.recordSale({}, session('cs_test_4', 'ghost')), 'unknown-code');
assert.equal(await lib.recordSale({}, session('cs_test_5', undefined)), 'no-code');

// The partner's dashboard: right key only, no buyer details
assert.equal((await call('dashboard', { method: 'GET', query: { code: 'ama', key: 'x'.repeat(32) } })).status, 404);
assert.equal((await call('dashboard', { method: 'GET', query: { code: 'ghost', key } })).status, 404);
const dash = (await call('dashboard', { method: 'GET', query: { code: 'ama', key } })).body;
assert.equal(dash.clicks, 1);
assert.equal(dash.orders, 2);
assert.equal(dash.salesCents, 9447 + 3000);
// New sales wait for validation: nothing is owed yet.
assert.equal(dash.pendingCents, Math.round(9447 * 0.15) + Math.round(3000 * 0.15));
assert.equal(dash.commissionCents, 0);
assert.equal(dash.owedCents, 0);
assert.equal(dash.bottlesThisMonth, 6);
assert.equal(dash.validatedThisMonth, 0);
assert.equal(dash.sales.length, 3);
assert.ok(dash.sales.every((s) => !('sessionId' in s)));

// Validation: one by one, only once, and never an own purchase
assert.equal((await adminCall({ action: 'validate-sale', code: 'ama', sessionId: 'cs_test_1' })).status, 200);
assert.equal((await adminCall({ action: 'validate-sale', code: 'ama', sessionId: 'cs_test_1' })).body.error, 'sale-not-pending');
assert.equal((await adminCall({ action: 'validate-sale', code: 'ama', sessionId: 'cs_test_3' })).body.error, 'sale-not-pending');
assert.equal((await adminCall({ action: 'validate-sale', code: 'ama', sessionId: 'cs_nope' })).body.error, 'sale-not-found');
// "Older than 30 days" leaves today's sale alone; with no age limit it is validated
assert.equal((await adminCall({ action: 'validate-all', code: 'ama', olderThanDays: 30 })).body.validated, 0);
assert.equal((await adminCall({ action: 'validate-all', code: 'ama' })).body.validated, 1);
const validated = (await call('dashboard', { method: 'GET', query: { code: 'ama', key } })).body;
assert.equal(validated.pendingCents, 0);
assert.equal(validated.commissionCents, Math.round(9447 * 0.15) + Math.round(3000 * 0.15));
assert.equal(validated.validatedThisMonth, 6);
// $18.67 is owed, which is under the $25 minimum, so nothing is payable yet
assert.equal(validated.minPayoutCents, 2500);
assert.equal(validated.payableCents, 0);
assert.equal(validated.suggestedRatePercent, null, '6 bottles is below the first step');
assert.ok(!JSON.stringify(dash).includes('buyer@example.com'));
assert.ok(!JSON.stringify(dash).includes('keyHash'));

// Payouts reduce what is owed; a voided sale stops earning
assert.equal((await adminCall({ action: 'payout', code: 'ama', amount: 10 })).status, 200);
assert.equal((await adminCall({ action: 'payout', code: 'ama', amount: -5 })).body.error, 'invalid-amount');
assert.equal((await adminCall({ action: 'void-sale', code: 'ama', sessionId: 'cs_test_2' })).status, 200);
const after = (await call('dashboard', { method: 'GET', query: { code: 'ama', key } })).body;
assert.equal(after.commissionCents, Math.round(9447 * 0.15));
assert.equal(after.owedCents, Math.round(9447 * 0.15) - 1000);
assert.equal((await adminCall({ action: 'void-sale', code: 'ama', sessionId: 'cs_test_3' })).body.error, 'sale-not-pending');

// The performance ladder: validated bottles in a month suggest a rate, and never lower one
for (let i = 0; i < 4; i++) await lib.recordSale({}, session(`cs_six_${i}`, 'ama', { metadata: { affiliate: 'ama', product_id: 'molivite-6-month', quantity: '1' } }));
await adminCall({ action: 'validate-all', code: 'ama' });
let ladder = (await adminCall({ action: 'overview' })).body.partners.find((p) => p.code === 'ama');
assert.equal(ladder.validatedThisMonth, 27);
assert.equal(ladder.suggestedRatePercent, 18, '25 bottles reaches 18%');
assert.ok(ladder.payableCents >= 2500);
assert.equal((await adminCall({ action: 'update', code: 'ama', tier: 'nonsense' })).body.error, 'unknown-tier');
assert.equal((await adminCall({ action: 'update', code: 'ama', tier: 'creator', ratePercent: 20 })).status, 200);
ladder = (await adminCall({ action: 'overview' })).body.partners.find((p) => p.code === 'ama');
assert.equal(ladder.tier, 'creator');
assert.equal(ladder.suggestedRatePercent, null, 'already above what the ladder gives');
await lib.recordSale({}, session('cs_bulk', 'ama', { metadata: { affiliate: 'ama', product_id: 'molivite-6-month', quantity: '13' } }));
await adminCall({ action: 'validate-all', code: 'ama' });
ladder = (await adminCall({ action: 'overview' })).body.partners.find((p) => p.code === 'ama');
assert.equal(ladder.validatedThisMonth, 105);
assert.equal(ladder.suggestedRatePercent, 25);

// Pausing stops new sales; a new private link retires the old one
assert.equal((await adminCall({ action: 'update', code: 'ama', status: 'paused' })).status, 200);
assert.equal(await lib.recordSale({}, session('cs_test_6', 'ama')), 'partner-paused');
const relinked = (await adminCall({ action: 'update', code: 'ama', status: 'active', newLink: true })).body;
assert.equal((await call('dashboard', { method: 'GET', query: { code: 'ama', key } })).status, 404);
assert.equal((await call('dashboard', { method: 'GET', query: { code: 'ama', key: relinked.dashboardLink.split('#')[1] } })).status, 200);

// The overview adds up
view = (await adminCall({ action: 'overview' })).body;
assert.equal(view.partners.length, 2);
assert.equal(view.partners[0].code, 'ama');
assert.equal(view.partners[0].paidCents, 1000);
assert.equal((await adminCall({ action: 'launch-missiles' })).body.error, 'unknown-action');
assert.equal((await call('nowhere', { body: {} })).status, 404);

console.log('affiliates: all checks passed');

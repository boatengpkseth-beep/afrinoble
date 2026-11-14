/**
 * The partner (affiliate) programme's records and rules.
 *
 * Everything lives in one Netlify Blobs store, `affiliates`:
 *   app/<id>                 an application from the Partners page
 *   partner/<code>           an approved partner: rate, status, link code
 *   sale/<code>/<sessionId>  one paid order credited to that partner
 *
 * Rules worth knowing:
 *   - Checkout never depends on this store. A `?ref=` code rides along on the
 *     Stripe session untouched, and is only checked here once the order is
 *     paid. If the code is unknown or the partner is paused, no sale is
 *     recorded.
 *   - Commission is the partner's rate at the time of sale, on the goods
 *     value (after discounts, before shipping and tax).
 *   - A new sale is `pending`. It only counts as money owed once the owner
 *     has validated it (`earned`); a refunded or cancelled order earns nothing.
 *   - Commission is paid monthly, once at least $25 is owed.
 *   - Each partner sits in a tier with a usual rate. Rates never change by
 *     themselves: the overview only suggests a rise when a partner's
 *     validated bottles in a month reach the next step.
 *   - A partner buying through their own link earns nothing.
 *   - A sale is keyed by the Stripe session id, so a redelivered webhook
 *     cannot credit it twice.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { connectLambda, getStore } from '@netlify/blobs';

const STORE = 'affiliates';
const CODE = /^[a-z0-9][a-z0-9_-]{1,31}$/;
const SITE = 'https://www.molivite.com';

/** Tiers and the rate each one usually carries. An ambassador's rate is agreed one by one. */
export const TIERS = { starter: 10, standard: 15, creator: 20, top: 25, ambassador: null };
/** Validated bottles in one calendar month, and the rate that volume earns. */
export const LADDER = [
  [100, 25],
  [50, 20],
  [25, 18],
  [10, 15],
];
export const MIN_PAYOUT_CENTS = 2500;
const PACK = { 'molivite-1-month': 1, 'molivite-3-month': 3, 'molivite-6-month': 6 };

/** The calendar month a moment falls in, by Eastern time: `2026-11`. */
const monthOf = (when) => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit' }).formatToParts(new Date(when));
  return `${parts.find((p) => p.type === 'year').value}-${parts.find((p) => p.type === 'month').value}`;
};
const monthBefore = (month) => {
  const [y, m] = month.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
};
const ladderRate = (bottles) => (LADDER.find(([min]) => bottles >= min) ?? [0, 0])[1];

let testStore = null;
/** Tests swap in an in-memory store so nothing touches Netlify. */
export function useStoreForTests(store) {
  testStore = store;
}

/**
 * The store. Called with no event from the current-format function
 * (affiliate.js), where strong consistency is available, so an approval is
 * visible to the very next read. Called with the Lambda event from the Stripe
 * webhook, which is an older-format function: there the store has to be
 * connected by hand and only eventual consistency is offered. That is fine
 * for the webhook, which only adds a sale under a key unique to the order.
 */
function db(event) {
  if (testStore) return testStore;
  if (!event) return getStore({ name: STORE, consistency: 'strong' });
  connectLambda(event);
  return getStore(STORE);
}

export const normaliseCode = (raw) => {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toLowerCase();
  return CODE.test(code) ? code : null;
};

const sha = (s) => createHash('sha256').update(s).digest('hex');
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = (v) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(v);

export function sameSecret(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string' || !expected) return false;
  const a = Buffer.from(sha(given));
  const b = Buffer.from(sha(expected));
  return timingSafeEqual(a, b);
}

async function listAll(store, prefix) {
  const { blobs } = await store.list({ prefix });
  const rows = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })));
  return rows.filter(Boolean);
}

/** Turn a name or preference into a free code: `ama`, then `ama2`, `ama3`... */
async function freeCode(store, wanted, name) {
  const base =
    normaliseCode(wanted) ??
    normaliseCode(
      String(name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '')
        .slice(0, 20),
    ) ??
    `partner${randomBytes(2).toString('hex')}`;
  for (let n = 1; n < 500; n++) {
    const code = n === 1 ? base : `${base.slice(0, 28)}${n}`;
    if (!(await store.get(`partner/${code}`, { type: 'json' }))) return code;
  }
  return `partner${randomBytes(4).toString('hex')}`;
}

// ---------------------------------------------------------------- public

/** Save an application from the Partners page. */
export async function apply(event, body) {
  const store = db(event);
  if (clean(body['company-website'], 200)) return { ok: true }; // honeypot: pretend, store nothing
  const app = {
    id: `${Date.now().toString(36)}${randomBytes(4).toString('hex')}`,
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    type: clean(body['partner-type'], 60),
    preferredCode: normaliseCode(body['preferred-code']) ?? '',
    channels: clean(body.channels, 300),
    about: clean(body.about, 1500),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  if (!app.name || !isEmail(app.email)) return { error: 'invalid-application' };
  // A flood of junk must not fill the store.
  const { blobs } = await store.list({ prefix: 'app/' });
  if (blobs.length >= 500) return { error: 'applications-full' };
  await store.setJSON(`app/${app.id}`, app);
  return { ok: true };
}

/** Count a visit that arrived on an active partner's link. */
export async function click(event, rawCode) {
  const code = normaliseCode(rawCode);
  if (!code) return { ok: true };
  const store = db(event);
  const partner = await store.get(`partner/${code}`, { type: 'json' });
  if (!partner || partner.status !== 'active') return { ok: true };
  partner.clicks = (partner.clicks ?? 0) + 1;
  await store.setJSON(`partner/${code}`, partner);
  return { ok: true };
}

function summarise(partner, sales, now = Date.now()) {
  const earned = sales.filter((s) => s.status === 'earned');
  const pending = sales.filter((s) => s.status === 'pending');
  const live = [...earned, ...pending];
  const commissionCents = earned.reduce((n, s) => n + s.commissionCents, 0);
  const owedCents = Math.max(0, commissionCents - (partner.paidCents ?? 0));
  const thisMonth = monthOf(now);
  const lastMonth = monthBefore(thisMonth);
  const bottlesIn = (rows, month) => rows.filter((s) => monthOf(s.createdAt) === month).reduce((n, s) => n + (s.bottles ?? 0), 0);
  const validatedThisMonth = bottlesIn(earned, thisMonth);
  const validatedLastMonth = bottlesIn(earned, lastMonth);
  const ratePercent = Math.round(partner.rate * 1000) / 10;
  const reached = ladderRate(Math.max(validatedThisMonth, validatedLastMonth));
  return {
    code: partner.code,
    name: partner.name,
    status: partner.status,
    tier: partner.tier ?? '',
    rate: partner.rate,
    link: `${SITE}/?ref=${partner.code}`,
    clicks: partner.clicks ?? 0,
    orders: live.length,
    salesCents: live.reduce((n, s) => n + s.amountCents, 0),
    pendingCents: pending.reduce((n, s) => n + s.commissionCents, 0),
    pendingOrders: pending.length,
    commissionCents,
    paidCents: partner.paidCents ?? 0,
    owedCents,
    minPayoutCents: MIN_PAYOUT_CENTS,
    payableCents: owedCents >= MIN_PAYOUT_CENTS ? owedCents : 0,
    bottlesThisMonth: bottlesIn(live, thisMonth),
    validatedThisMonth,
    validatedLastMonth,
    // Only ever a suggestion: the owner changes the rate, and 25% needs a margin review first.
    suggestedRatePercent: reached > ratePercent ? reached : null,
  };
}

/** What a partner sees. Needs their private key; never includes buyer details. */
export async function dashboard(event, rawCode, key) {
  const code = normaliseCode(rawCode);
  if (!code || typeof key !== 'string' || key.length < 20) return null;
  const store = db(event);
  const partner = await store.get(`partner/${code}`, { type: 'json' });
  if (!partner || !sameSecret(sha(key), partner.keyHash)) return null;
  const sales = (await listAll(store, `sale/${code}/`)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return {
    ...summarise(partner, sales),
    sales: sales.slice(0, 100).map((s) => ({ date: s.createdAt, product: s.productId, bottles: s.bottles ?? null, amountCents: s.amountCents, commissionCents: s.commissionCents, status: s.status })),
  };
}

// ---------------------------------------------------------------- orders

/**
 * Credit a paid Checkout Session to its partner, if it has one.
 * Returns a short reason string for the log; never throws for "no partner".
 */
export async function recordSale(event, session) {
  const code = normaliseCode(session?.metadata?.affiliate);
  if (!code) return 'no-code';
  const store = db(event);
  const partner = await store.get(`partner/${code}`, { type: 'json' });
  if (!partner) return 'unknown-code';
  if (partner.status !== 'active') return 'partner-paused';
  const key = `sale/${code}/${session.id}`;
  if (await store.get(key, { type: 'json' })) return 'already-recorded';

  const buyer = (session.customer_details?.email ?? '').toLowerCase();
  const self = buyer && buyer === partner.email;
  const goods = Math.max(0, (session.amount_subtotal ?? session.amount_total ?? 0) - (session.total_details?.amount_discount ?? 0));
  const productId = session.metadata?.product_id ?? null;
  const quantity = Math.min(99, Math.max(1, Number(session.metadata?.quantity) || 1));
  await store.setJSON(key, {
    sessionId: session.id,
    code,
    productId,
    bottles: (PACK[productId] ?? 1) * quantity,
    amountCents: goods,
    rate: partner.rate,
    commissionCents: self ? 0 : Math.round(goods * partner.rate),
    // Pending until the owner validates it, so a refund inside the return window is never paid out.
    status: self ? 'own-purchase' : 'pending',
    createdAt: new Date().toISOString(),
  });
  return self ? 'own-purchase' : 'recorded';
}

// ---------------------------------------------------------------- admin

function privateLink(code, key) {
  return `${SITE}/partner?code=${code}#${key}`;
}

const validTier = (raw) => (typeof raw === 'string' && Object.hasOwn(TIERS, raw) ? raw : null);

/** The rate asked for, or failing that the usual rate of the tier. */
function rateFor(body, tier) {
  const given = body.ratePercent;
  if (given !== undefined && given !== null && given !== '') return validRate(given);
  return tier && TIERS[tier] ? validRate(TIERS[tier]) : null;
}

function validRate(raw) {
  const pct = Number(raw);
  return Number.isFinite(pct) && pct > 0 && pct <= 60 ? Math.round(pct * 100) / 10000 : null;
}

/** Every admin action. `body.action` picks one; unknown actions are refused. */
export async function admin(event, body) {
  const store = db(event);
  switch (body.action) {
    case 'overview': {
      const [apps, partners, sales] = await Promise.all([listAll(store, 'app/'), listAll(store, 'partner/'), listAll(store, 'sale/')]);
      return {
        applications: apps.filter((a) => a.status === 'pending').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        partners: partners
          .map((p) => ({ ...summarise(p, sales.filter((s) => s.code === p.code)), email: p.email, createdAt: p.createdAt }))
          .sort((a, b) => b.commissionCents - a.commissionCents || a.name.localeCompare(b.name)),
      };
    }

    case 'approve': {
      // From an application (`appId`) or entered by hand (`name` + `email`).
      const app = body.appId ? await store.get(`app/${clean(body.appId, 40)}`, { type: 'json' }) : null;
      if (body.appId && (!app || app.status !== 'pending')) return { error: 'application-not-found' };
      const name = app?.name ?? clean(body.name, 120);
      const email = app?.email ?? clean(body.email, 254).toLowerCase();
      if (body.tier && !validTier(body.tier)) return { error: 'unknown-tier' };
      const tier = validTier(body.tier) ?? '';
      const rate = rateFor(body, tier);
      if (!name || !isEmail(email)) return { error: 'name-and-email-required' };
      if (rate === null) return { error: 'rate-must-be-1-to-60-percent' };
      const wanted = normaliseCode(body.code);
      if (body.code && !wanted) return { error: 'invalid-code' };
      if (wanted && (await store.get(`partner/${wanted}`, { type: 'json' }))) return { error: 'code-taken' };
      const code = wanted ?? (await freeCode(store, app?.preferredCode, name));
      const key = randomBytes(24).toString('base64url');
      await store.setJSON(`partner/${code}`, { code, name, email, tier, rate, status: 'active', keyHash: sha(key), clicks: 0, paidCents: 0, createdAt: new Date().toISOString() });
      if (app) await store.setJSON(`app/${app.id}`, { ...app, status: 'approved', code });
      // The private link is shown once: only its hash is stored.
      return { partner: { code, name, email, tier, rate }, link: `${SITE}/?ref=${code}`, dashboardLink: privateLink(code, key) };
    }

    case 'decline': {
      const app = await store.get(`app/${clean(body.appId, 40)}`, { type: 'json' });
      if (!app) return { error: 'application-not-found' };
      await store.setJSON(`app/${app.id}`, { ...app, status: 'declined' });
      return { ok: true };
    }

    case 'update': {
      const code = normaliseCode(body.code);
      const partner = code && (await store.get(`partner/${code}`, { type: 'json' }));
      if (!partner) return { error: 'partner-not-found' };
      if (body.status === 'active' || body.status === 'paused') partner.status = body.status;
      if (body.tier !== undefined) {
        if (!validTier(body.tier)) return { error: 'unknown-tier' };
        partner.tier = body.tier;
      }
      if (body.ratePercent !== undefined) {
        const rate = validRate(body.ratePercent);
        if (rate === null) return { error: 'rate-must-be-1-to-60-percent' };
        partner.rate = rate; // applies to future sales only
      }
      let dashboardLink;
      if (body.newLink === true) {
        const key = randomBytes(24).toString('base64url');
        partner.keyHash = sha(key);
        dashboardLink = privateLink(code, key);
      }
      await store.setJSON(`partner/${code}`, partner);
      return { ok: true, dashboardLink };
    }

    case 'payout': {
      const code = normaliseCode(body.code);
      const partner = code && (await store.get(`partner/${code}`, { type: 'json' }));
      const cents = Math.round(Number(body.amount) * 100);
      if (!partner) return { error: 'partner-not-found' };
      if (!Number.isFinite(cents) || cents <= 0 || cents > 5_000_000) return { error: 'invalid-amount' };
      partner.paidCents = (partner.paidCents ?? 0) + cents;
      partner.payouts = [...(partner.payouts ?? []), { cents, at: new Date().toISOString(), note: clean(body.note, 140) }].slice(-200);
      await store.setJSON(`partner/${code}`, partner);
      return { ok: true };
    }

    case 'validate-sale': {
      // The order was delivered and kept: its commission is now owed.
      const code = normaliseCode(body.code);
      const key = `sale/${code}/${clean(body.sessionId, 120)}`;
      const sale = code && (await store.get(key, { type: 'json' }));
      if (!sale) return { error: 'sale-not-found' };
      if (sale.status !== 'pending') return { error: 'sale-not-pending' };
      await store.setJSON(key, { ...sale, status: 'earned', validatedAt: new Date().toISOString() });
      return { ok: true };
    }

    case 'validate-all': {
      // Every pending sale for one partner that is at least `olderThanDays` old.
      const code = normaliseCode(body.code);
      if (!code) return { error: 'partner-not-found' };
      const days = Math.min(365, Math.max(0, Number(body.olderThanDays) || 0));
      const cutoff = new Date(Date.now() - days * 864e5).toISOString();
      const due = (await listAll(store, `sale/${code}/`)).filter((s) => s.status === 'pending' && s.createdAt <= cutoff);
      const validatedAt = new Date().toISOString();
      await Promise.all(due.map((s) => store.setJSON(`sale/${code}/${s.sessionId}`, { ...s, status: 'earned', validatedAt })));
      return { ok: true, validated: due.length };
    }

    case 'void-sale': {
      // For a refunded order: the sale stays on record but earns nothing.
      const code = normaliseCode(body.code);
      const key = `sale/${code}/${clean(body.sessionId, 120)}`;
      const sale = code && (await store.get(key, { type: 'json' }));
      if (!sale) return { error: 'sale-not-found' };
      if (sale.status === 'own-purchase') return { error: 'sale-not-pending' };
      await store.setJSON(key, { ...sale, status: 'refunded', commissionCents: 0 });
      return { ok: true };
    }

    case 'sales': {
      const code = normaliseCode(body.code);
      if (!code) return { error: 'partner-not-found' };
      return { sales: (await listAll(store, `sale/${code}/`)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 200) };
    }

    default:
      return { error: 'unknown-action' };
  }
}

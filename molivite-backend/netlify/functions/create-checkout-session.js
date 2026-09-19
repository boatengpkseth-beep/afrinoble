/**
 * POST /create-checkout-session
 *
 * Creates a Stripe Checkout Session in EMBEDDED mode for one of the MoLivite
 * supplies and returns its client secret. The frontend mounts the form with
 * `stripe.initEmbeddedCheckout({ clientSecret })`.
 *
 * Body: { items: [{ id, quantity }], returnUrl }
 *   - id: one of the PRODUCTS keys below; omitted → the 1-month supply,
 *     anything else → 400 `unknown-product`.
 *   - quantity: taken from the first item, default 1, clamped to 1..99.
 *   - returnUrl: must be an https page on molivite.com (or Netlify Dev) and
 *     carry the {CHECKOUT_SESSION_ID} placeholder; otherwise the default
 *     https://molivite.com/checkout?session_id={CHECKOUT_SESSION_ID} is used.
 *
 * Prices and products are fixed server-side. The client can never choose what
 * it pays — only which supply and how many.
 */
import { stripe, corsHeaders, originOf, json, preflight, methodNotAllowed } from '../lib/http.js';

// Bundle prices match the storefront: 3-month is 10% off, 6-month 20% off
// the straight multiple of the $34.99 bottle.
const PRODUCTS = {
  'molivite-1-month': {
    id: 'molivite-1-month',
    name: 'MoLivite — 1-Month Supply',
    description: '60 Capsules',
    unitAmount: 3499, // cents → $34.99
    currency: 'usd',
  },
  'molivite-3-month': {
    id: 'molivite-3-month',
    name: 'MoLivite — 3-Month Supply',
    description: '180 Capsules (3 Bottles)',
    unitAmount: 9447, // cents → $94.47
    currency: 'usd',
  },
  'molivite-6-month': {
    id: 'molivite-6-month',
    name: 'MoLivite — 6-Month Supply',
    description: '360 Capsules (6 Bottles)',
    unitAmount: 16795, // cents → $167.95
    currency: 'usd',
  },
};
const DEFAULT_PRODUCT_ID = 'molivite-1-month';

const DEFAULT_RETURN_URL = 'https://molivite.com/checkout?session_id={CHECKOUT_SESSION_ID}';
const RETURN_HOSTS = new Set(['molivite.com', 'www.molivite.com', 'localhost:8888']);

/**
 * The Stripe account is shared with the house's other store (Afrinoble), so
 * the card statement is stamped per order: `<account prefix>* MOLIVITE`.
 * If the account's prefix is too long for Stripe's 22-character limit the
 * session is retried without the suffix rather than failing the sale.
 */
const STATEMENT_SUFFIX = 'MOLIVITE';

function clampQuantity(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1;
  return Math.min(99, Math.max(1, Math.floor(n)));
}

function safeReturnUrl(raw) {
  if (typeof raw !== 'string' || !raw.includes('{CHECKOUT_SESSION_ID}')) return DEFAULT_RETURN_URL;
  try {
    const url = new URL(raw);
    const secure = url.protocol === 'https:' || url.host === 'localhost:8888';
    return secure && RETURN_HOSTS.has(url.host) ? raw : DEFAULT_RETURN_URL;
  } catch {
    return DEFAULT_RETURN_URL;
  }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight(event);
  if (event.httpMethod !== 'POST') return methodNotAllowed(event, 'POST, OPTIONS');
  const cors = corsHeaders(originOf(event));

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'invalid-json' }, cors);
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const product = PRODUCTS[items[0]?.id ?? DEFAULT_PRODUCT_ID];
  if (!product) return json(400, { error: 'unknown-product' }, cors);
  const quantity = clampQuantity(items[0]?.quantity ?? 1);
  const returnUrl = safeReturnUrl(body.returnUrl);

  const params = (withSuffix) => ({
    ui_mode: 'embedded_page',
    mode: 'payment',
    line_items: [
      {
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.unitAmount,
          product_data: {
            name: product.name,
            description: product.description,
            metadata: { product_id: product.id },
          },
        },
      },
    ],
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ'] },
    // Tax is deliberately not hard-coded. To collect it with Stripe Tax:
    //   1. Dashboard → Tax → add a registration for each state/country and
    //      wait until it shows "Collecting" (without one Stripe collects nothing).
    //   2. Set `automatic_tax: { enabled: true }` here and add
    //      `tax_behavior: 'exclusive'` (or 'inclusive') to price_data above,
    //      plus a `tax_code` on product_data (Dashboard → Tax → Settings).
    automatic_tax: { enabled: false },
    metadata: { product_id: product.id, quantity: String(quantity) },
    payment_intent_data: {
      description: `${product.name} (${product.description}) × ${quantity}`,
      metadata: { product_id: product.id, quantity: String(quantity) },
      ...(withSuffix ? { statement_descriptor_suffix: STATEMENT_SUFFIX } : {}),
    },
    return_url: returnUrl,
  });

  try {
    let session;
    try {
      session = await stripe.checkout.sessions.create(params(true));
    } catch (err) {
      if (!/statement_descriptor/i.test(err?.message ?? '')) throw err;
      console.warn('create-checkout-session: statement descriptor suffix rejected, retrying without it');
      session = await stripe.checkout.sessions.create(params(false));
    }
    return json(200, { clientSecret: session.client_secret }, cors);
  } catch (err) {
    // Server-side detail only. The client gets a fixed error code, never
    // Stripe's message (which can name account settings) and never a key.
    console.error('create-checkout-session failed:', err?.type ?? 'error', err?.code ?? '', err?.message ?? err);
    return json(500, { error: 'create-session-failed' }, cors);
  }
};

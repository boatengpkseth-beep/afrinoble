/**
 * Creates a Stripe Checkout Session in EMBEDDED mode, so the payment form
 * renders inside afrinoble.netlify.app instead of redirecting to Stripe.
 *
 * The price charged is the one the site shows (`price` / `currency` in
 * src/data/products.js) — the catalog is the single source of truth, so the
 * embedded form can never disagree with the product page. The product's
 * Payment Link is only used as the fallback when no key is configured.
 *
 * Needs STRIPE_SECRET_KEY in the Netlify environment. Without it, the site
 * falls back to opening the Payment Link itself (a redirect) — never a broken
 * button.
 */
import Stripe from 'stripe';
import { products } from '../../src/data/products.js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const BRAND = 'Afrinoble';
/** Labels every session in the Dashboard so this flow can be compared with others. */
const INTEGRATION_ID = 'afrinoble-buy-now-qmvxtrkb';
// Switches the house flips in Netlify once the matching Stripe setup exists.
// Stripe Tax collects nothing until a registration is active, and Stripe
// bills an invoicing fee per invoice — so both are off until asked for.
const AUTOMATIC_TAX = process.env.STRIPE_AUTOMATIC_TAX === '1';
const INVOICES = process.env.STRIPE_INVOICES === '1';
/** Product tax code from Stripe's list (e.g. clothing); tax_behavior stays exclusive. */
const TAX_CODE = process.env.STRIPE_TAX_CODE || null;
/** Appended to the account's card-statement descriptor: e.g. `GATUS* AFRINOBLE`. */
const STATEMENT_SUFFIX = 'AFRINOBLE';

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!stripe) return json(503, { error: 'not_configured' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'bad_json' });
  }
  const product = products.find((p) => p.slug === body.slug);
  if (!product?.paymentLink) return json(404, { error: 'not_for_sale' });
  const quantity = Number.isInteger(body.quantity) && body.quantity > 0 && body.quantity <= 10 ? body.quantity : 1;
  const size = typeof body.size === 'string' && product.sizes?.includes(body.size) ? body.size : null;

  const origin = event.headers.origin || `https://${event.headers.host}`;
  const label = `${product.name}${size ? ` — size ${size}` : ''}`;

  // The Stripe account is shared with the house's other businesses, so its
  // public name is not Afrinoble. Everything that belongs to the ORDER is
  // stamped with the brand instead: the line item, the charge description,
  // the card-statement suffix and the note under the Pay button.
  const params = (withSuffix) => ({
    ui_mode: 'embedded',
    mode: 'payment',
    line_items: [
      {
        quantity,
        price_data: {
          currency: (product.currency || 'USD').toLowerCase(),
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: `Afrinoble · ${product.name}`,
            description: product.description,
            images: (product.images || []).slice(0, 1).map((src) => `${origin}${src}`),
            metadata: { slug: product.slug, brand: BRAND },
            ...(TAX_CODE ? { tax_code: TAX_CODE } : {}),
          },
          ...(AUTOMATIC_TAX ? { tax_behavior: 'exclusive' } : {}),
        },
      },
    ],
    integration_identifier: INTEGRATION_ID,
    ...(AUTOMATIC_TAX ? { automatic_tax: { enabled: true } } : {}),
    ...(INVOICES ? { invoice_creation: { enabled: true, invoice_data: { description: `${BRAND} — ${label}`, metadata: { brand: BRAND, slug: product.slug } } } } : {}),
    shipping_address_collection: { allowed_countries: ['US', 'GB', 'CA', 'GH', 'NG', 'FR', 'DE', 'NL'] },
    metadata: { brand: BRAND, slug: product.slug, size: size ?? '', product: product.name },
    payment_intent_data: {
      description: `${BRAND}: ${label}`,
      metadata: { brand: BRAND, slug: product.slug },
      ...(withSuffix ? { statement_descriptor_suffix: STATEMENT_SUFFIX } : {}),
    },
    custom_text: {
      submit: {
        message: `You are ordering from ${BRAND}. ${BRAND} is a house of Gatus LLC, so that name may also appear on your receipt and card statement.`,
      },
    },
    return_url: `${origin}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
  });

  try {
    let session;
    try {
      session = await stripe.checkout.sessions.create(params(true));
    } catch (err) {
      // The suffix rides on the account's own descriptor and the pair must fit
      // in 22 characters. If the account's prefix is too long, sell without it
      // rather than fail the sale.
      if (!/statement_descriptor/i.test(err.message)) throw err;
      console.warn('statement descriptor suffix rejected; retrying without it:', err.message);
      session = await stripe.checkout.sessions.create(params(false));
    }
    return json(200, { clientSecret: session.client_secret });
  } catch (err) {
    console.error('checkout session failed', err);
    return json(502, { error: 'stripe_error', message: err.message });
  }
};

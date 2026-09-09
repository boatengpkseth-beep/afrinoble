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
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: [
        {
          quantity,
          price_data: {
            currency: (product.currency || 'USD').toLowerCase(),
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.name,
              description: product.description,
              images: (product.images || []).slice(0, 1).map((src) => `${origin}${src}`),
              metadata: { slug: product.slug },
            },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ['US', 'GB', 'CA', 'GH', 'NG', 'FR', 'DE', 'NL'] },
      metadata: { slug: product.slug, size: size ?? '', product: product.name },
      payment_intent_data: { description: `${product.name}${size ? ` — size ${size}` : ''}` },
      return_url: `${origin}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    });
    return json(200, { clientSecret: session.client_secret });
  } catch (err) {
    console.error('checkout session failed', err);
    return json(502, { error: 'stripe_error', message: err.message });
  }
};

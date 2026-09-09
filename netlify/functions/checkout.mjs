/**
 * Creates a Stripe Checkout Session in EMBEDDED mode, so the payment form
 * renders inside afrinoble.netlify.app instead of redirecting to Stripe.
 *
 * The price comes from the product's Payment Link (`paymentLink` in
 * src/data/products.js): the link is looked up by URL and its line item's
 * Price is reused, so whatever the house set on the link is what is charged.
 * Links are resolved once and cached for the life of the function instance.
 *
 * Needs STRIPE_SECRET_KEY in the Netlify environment. Without it, the site
 * falls back to opening the Payment Link itself (a redirect) — never a broken
 * button.
 */
import Stripe from 'stripe';
import { products } from '../../src/data/products.js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const priceByLink = new Map();

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

async function priceForLink(url) {
  if (priceByLink.has(url)) return priceByLink.get(url);
  // Payment Link URLs are public ids; the API id is only reachable by listing.
  let starting_after;
  for (let page = 0; page < 10; page++) {
    const links = await stripe.paymentLinks.list({ limit: 100, active: true, starting_after });
    const match = links.data.find((l) => l.url === url);
    if (match) {
      const items = await stripe.paymentLinks.listLineItems(match.id, { limit: 1 });
      const price = items.data[0]?.price?.id;
      if (!price) throw new Error('Payment Link has no line item');
      priceByLink.set(url, price);
      return price;
    }
    if (!links.has_more) break;
    starting_after = links.data[links.data.length - 1].id;
  }
  throw new Error('Payment Link not found on this Stripe account');
}

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
    const price = await priceForLink(product.paymentLink);
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: [{ price, quantity }],
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

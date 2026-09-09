/**
 * Creates the Afrinoble catalog in Stripe: one Product per item, one one-off
 * USD Price per Product, with the site slug as the price's lookup_key so the
 * storefront can find a price by the same key it already uses.
 *
 * Idempotent: re-running updates names/descriptions and reuses the existing
 * price when the amount is unchanged; a changed amount archives the old price
 * and creates a new one (Stripe prices are immutable by design).
 *
 * Usage — run against TEST keys first, then LIVE:
 *   npm i stripe
 *   STRIPE_SECRET_KEY=sk_test_... node stripe/create-stripe-catalog.mjs
 *   STRIPE_SECRET_KEY=sk_live_... node stripe/create-stripe-catalog.mjs
 *
 * Add --dry-run to print what would happen without touching Stripe.
 */
import Stripe from 'stripe';
import { products } from '../src/data/products.js';

const SITE = 'https://afrinoble.netlify.app';
const key = process.env.STRIPE_SECRET_KEY;
const dryRun = process.argv.includes('--dry-run');
if (!key && !dryRun) {
  console.error('Set STRIPE_SECRET_KEY (sk_test_… or sk_live_…), or pass --dry-run.');
  process.exit(1);
}
const stripe = key ? new Stripe(key) : null;

let created = 0;
let updated = 0;
let repriced = 0;

for (const p of products) {
  const unitAmount = Math.round(p.price * 100);
  const productData = {
    name: p.name,
    description: p.description,
    images: p.images.slice(0, 8).map((path) => `${SITE}${path}`),
    shippable: true,
    metadata: {
      slug: p.slug,
      collection: p.collection,
      fabric: p.fabric,
      sizes: p.sizes.join('|'),
      availability: p.availability,
    },
  };

  if (dryRun) {
    console.log(`${p.slug.padEnd(28)} ${p.name.padEnd(34)} $${p.price.toFixed(2).padStart(7)}  ${p.availability}`);
    continue;
  }

  // Find by slug so a re-run never duplicates.
  const found = await stripe.products.search({ query: `metadata['slug']:'${p.slug}'`, limit: 1 });
  let product = found.data[0];
  if (product) {
    product = await stripe.products.update(product.id, productData);
    updated += 1;
  } else {
    product = await stripe.products.create(productData);
    created += 1;
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
  const current = prices.data.find((pr) => pr.currency === 'usd' && pr.unit_amount === unitAmount && pr.type === 'one_time');
  if (!current) {
    for (const stale of prices.data) await stripe.prices.update(stale.id, { active: false, lookup_key: undefined });
    const price = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      unit_amount: unitAmount,
      lookup_key: p.slug,
      transfer_lookup_key: true,
    });
    await stripe.products.update(product.id, { default_price: price.id });
    repriced += 1;
  } else if (product.default_price !== current.id) {
    await stripe.products.update(product.id, { default_price: current.id });
  }
  console.log(`✓ ${p.name} — $${p.price} (${product.id})`);
}

if (!dryRun) {
  console.log(`\nDone. ${created} created, ${updated} updated, ${repriced} priced. ${products.length} products in Stripe.`);
}

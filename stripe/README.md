# Stripe catalog for Afrinoble

Two ways to get the 38 products into Stripe. Both read from the same source
of truth, `src/data/products.js`, so the site and Stripe never disagree.

## 1. Script (recommended — repeatable)

```bash
npm i stripe
STRIPE_SECRET_KEY=sk_test_... node stripe/create-stripe-catalog.mjs   # test mode first
STRIPE_SECRET_KEY=sk_live_... node stripe/create-stripe-catalog.mjs   # then live
```

`--dry-run` prints the list without touching Stripe. Re-running is safe: it
finds each product by its slug (`metadata.slug`), updates copy and images, and
only creates a new price when the amount changed. Each price carries the slug
as its `lookup_key`, so checkout can resolve a price with the same key the
site already uses (`prices.list({ lookup_keys: ['adaeze-wrap-gown'] })`).

## 2. CSV (`afrinoble-products.csv`)

Name, description, price in USD and in cents, currency, SKU/lookup key,
collection, fabric, sizes, availability and the first image URL — one row per
product, for a manual set-up in the Dashboard or for the finance sheet.

## Before going live

- **Accessory prices are placeholders.** Sena Woven Clutch ($380) and Tobi
  Silk Scarf ($240) were never confirmed by the house; every other price was.
- **Photo rights.** Some supplied product photos originally carried third-party
  marks (cropped out). Confirm usage rights before the images go on receipts.
- **Made-to-order items** (all `availability: made-to-order`) should not be
  sold as in-stock: set the Stripe product's `shippable`/inventory handling
  to match, or collect measurements before capture.
- Sizes are in metadata, not as separate Stripe variants; add per-size prices
  only if sizes are ever priced differently.

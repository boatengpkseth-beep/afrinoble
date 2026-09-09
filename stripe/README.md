# Stripe for Afrinoble

## On-site checkout (what the "Buy now" button does)

Products with a `paymentLink` in `src/data/products.js` show **Buy now**.
Clicking it opens a panel *on the site* with Stripe's Embedded Checkout —
the buyer never leaves afrinoble. It works like this:

1. The page asks `/.netlify/functions/checkout` for a session.
2. The function creates an embedded Checkout Session at the **price shown on
   the site** (`price` in `src/data/products.js`) — the catalog is the single
   source of truth, so the form can never disagree with the product page.
3. Stripe's form mounts inside the panel. After payment the buyer lands on
   `/order/confirmed`, which shows the house's confirmation message.

If the keys below are not set, the panel offers a "Continue to payment"
button that opens the Payment Link instead (a redirect). Never a dead button.

### Keys to add in Netlify → Site configuration → Environment variables

| Variable | Where it comes from |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret key (`sk_live_…`; use `sk_test_…` first) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | same page → Publishable key (`pk_live_…` / `pk_test_…`) |

Then trigger a deploy. Test with Stripe's test card `4242 4242 4242 4242`
while on test keys.

### Payment Links currently wired

| Product | Link | Price on the link | Charged on site |
|---|---|---|---|
| Adaeze Wrap Gown | buy.stripe.com/3cI4gz3a8agP4RdaHp6g808 | $120.00 | $75 |
| Amara Silk Blouse | buy.stripe.com/28E8wP7qo4WvbfB5n56g809 | $120.00 | $75 |
| Zola Column Dress | buy.stripe.com/eVq7sL264ex5fvReXF6g80a | $120.00 | $75 |
| Chidinma Mini Dress | buy.stripe.com/14A28raCAfB92J55n56g80b | $120.00 | $75 |

The house decided on **$75** (2026-09-09). With keys set, the on-site form
charges $75. The links themselves still say $120 and are only reached by the
no-key fallback — edit each one to $75 in Stripe → Payment links, or leave
them unused.

**Still to fix in the Stripe Dashboard before real customers see this:**

1. **The public business name.** It appears on the checkout, the receipt and
   the card statement. Stripe → Settings → Business → Public details: set the
   name to Afrinoble (and a statement descriptor like `AFRINOBLE`).

Other items are still "Enquire" until they have a Payment Link — add one
per product, paste its URL as `paymentLink`, and the Buy button appears
(charging the site price).

## Bulk catalog (`create-stripe-catalog.mjs`, `afrinoble-products.csv`)

```bash
STRIPE_SECRET_KEY=sk_test_... node stripe/create-stripe-catalog.mjs --dry-run
STRIPE_SECRET_KEY=sk_test_... node stripe/create-stripe-catalog.mjs
```

Creates all 38 products with one USD price each (lookup key = site slug),
idempotently. The CSV is the same list for the Dashboard or the finance sheet.

## Before going live

- Accessory prices (clutch $380, scarf $240) were never confirmed.
- Confirm photo usage rights — product images appear on Stripe receipts.
- Made-to-order pieces should not be sold as in stock without collecting
  measurements first.

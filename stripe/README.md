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

All five links charge **$75**, the same as the site (re-issued 2026-09-09
after the house dropped the price from $120).

| Product | Link |
|---|---|
| Adaeze Wrap Gown | buy.stripe.com/7sYfZhcKIagP0AXaHp6g80c |
| Amara Silk Blouse | buy.stripe.com/6oUdR9264coX5Vh2aT6g80d |
| Zola Column Dress | buy.stripe.com/3cIbJ13a81KjabxaHp6g80e |
| Folasade Evening Caftan | buy.stripe.com/bJe7sL26460z2J502L6g80g |
| Chidinma Mini Dress | buy.stripe.com/4gMbJ1eSQfB94Rd8zh6g80h |

### The account is shared with Molivite (public name "Gatus Pharma LLC")

The account's public name cannot be changed to Afrinoble without renaming it
for Molivite too. So the checkout stamps the brand on everything that belongs
to the **order** instead (`checkout.mjs`): line item "Afrinoble · <piece>",
charge description "Afrinoble: <piece> — size", card-statement suffix
`AFRINOBLE` (rendered `<account prefix>* AFRINOBLE`; dropped automatically if
the account's prefix is too long for Stripe's 22-character limit), a note
under the Pay button, and a matching line on `/order/confirmed`.

What still carries the account name and cannot be overridden per order: the
"Pay securely at …" Link line, the header of Stripe's email receipt, and the
hosted Payment Link pages. The clean fix is a **second Stripe account named
Afrinoble under the same login and the same LLC** (account switcher → Create
new account); then swap the two keys in Netlify. Stripe allows one business to
run several accounts.

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

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

### Environment variables (Netlify → Site configuration → Environment variables)

Keys go here and nowhere else — never in the repository or in chat. A
pre-commit hook (`.githooks/pre-commit`, enabled with
`git config core.hooksPath .githooks`) refuses commits containing one.

| Variable | Required | What it is |
|---|---|---|
| `STRIPE_SECRET_KEY` | yes | Server key for the functions. Prefer a **restricted key** (`rk_live_…`, Developers → API keys → Create restricted key) with *Checkout Sessions: write* (add *Products: write* if Stripe returns a permissions error); a plain `sk_live_…` also works. Tick "Contains secret values". |
| `VITE_STRIPE_PUBLISHABLE_KEY` | yes | `pk_live_…`. Public by design; must NOT be marked secret or the build cannot read it. |
| `STRIPE_WEBHOOK_SECRET` | yes | `whsec_…` from the webhook endpoint below. Secret. |
| `STRIPE_AUTOMATIC_TAX` | no | `1` turns on Stripe Tax at checkout. Only after a tax registration is *Collecting* in Dashboard → Tax → Locations; without one Stripe silently collects nothing. |
| `STRIPE_TAX_CODE` | no | Product tax code from Stripe's list (Dashboard → Tax → Settings, or docs.stripe.com/tax/tax-codes), e.g. the code for clothing. Used with automatic tax. |
| `STRIPE_INVOICES` | no | `1` makes Stripe issue a proper invoice PDF for every paid order (Stripe charges its invoicing fee per invoice). |
| `RESEND_API_KEY` + `ORDER_NOTIFY_EMAIL` | no | When both are set the webhook emails the atelier for each paid order (and each failed async payment). `ORDER_FROM_EMAIL` optional. |

Change a variable, then **Deploys → Trigger deploy**; nothing applies until a new build.

### Webhook (required — this is what fulfils an order)

The confirmation page is a courtesy; the webhook is the record. Stripe calls
`netlify/functions/stripe-webhook.mjs`, which verifies the signature, writes
one JSON record per paid session to Netlify Blobs (Netlify → Blobs → `orders`)
and emails the atelier if Resend is configured.

The endpoint **already exists** on the account (created 2026-09-18, id
`we_1UGtzMIiecUBjlGC78Aec8xF`, description "Afrinoble order fulfilment"):

- URL: `https://afrinoble.netlify.app/.netlify/functions/stripe-webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`

What is still a manual step:

1. Dashboard → Developers → Webhooks → open that endpoint → **Reveal** the
   Signing secret (`whsec_…`) and put it in `STRIPE_WEBHOOK_SECRET`, then redeploy.
2. Also turn on Dashboard → Settings → Notifications → "Successful payments" email, so a human hears about every order even before Resend is set up.

(The other endpoint on the account, `stage.molivite.com/?wc-api=wc_stripe`,
belongs to Molivite's WooCommerce store. Leave it alone.)

### Content-Security-Policy

`netlify.toml` sends a CSP that allows scripts and frames only from this site
and Stripe, fonts only from Google. It is what lets Stripe.js keep its XSS
protection. Anything new that loads from another host must be added there.
(Vite's dev server injects an inline script that the policy blocks — use
`vite preview` or the live site to check the built page, not `netlify dev`.)

### Payment Links currently wired

All five links charge **$75**, the same as the site (re-issued 2026-09-09
after the house dropped the price from $120). The five $120 products, their
prices and their Payment Links from before the drop are archived; the only
active Afrinoble products in the Dashboard are the $75 ones behind these links.

| Product | Link |
|---|---|
| Adaeze Wrap Gown | buy.stripe.com/7sYfZhcKIagP0AXaHp6g80c |
| Amara Silk Blouse | buy.stripe.com/6oUdR9264coX5Vh2aT6g80d |
| Zola Column Dress | buy.stripe.com/3cIbJ13a81KjabxaHp6g80e |
| Folasade Evening Caftan | buy.stripe.com/bJe7sL26460z2J502L6g80g |
| Chidinma Mini Dress | buy.stripe.com/4gMbJ1eSQfB94Rd8zh6g80h |

### The account is shared with Molivite — one profile for both houses

Molivite and Afrinoble sell from the same Stripe account (`acct_1SS3wIIiecUBjlGC`,
legal entity Gatus Pharma LLC, single-member LLC, Apopka FL) with different
products and different websites. Stripe has one public profile per account,
so the profile names the **parent**, and each store stamps its own brand on
its orders. The Dashboard shows the current values under Settings → Business
→ Public details (name, description, website, support) and Settings →
Business → Bank accounts and currencies / Payments → Statement descriptor.
Stripe does not let an account edit its own public details through the API,
so these are set by hand, once:

| Setting | Was (Molivite-only) | Set to (fits both) |
|---|---|---|
| Public business name | `Gatus Pharma LLC` | `Gatus LLC` — the name both sites already print ("a house of Gatus LLC"); the legal name stays Gatus Pharma LLC |
| Product description | MoLivite capsules only | "Gatus LLC operates two online stores: MoLivite (molivite.com), a 10-in-1 immune-support capsule sold as 1, 3 and 6 month supplies, and Afrinoble (afrinoble.netlify.app), made-to-measure African-inspired clothing and accessories. Each order names its store on the receipt and card statement." |
| Statement descriptor | `MOLIVITE.COM` | `GATUS LLC` |
| Shortened descriptor (prefix) | `MOLIVITE.C` | `GATUS` — short so each store's suffix fits in 22 characters |
| Support email | none | the inbox that answers customers for both stores (the account login `gatuspharmallc@gmail.com` is the obvious choice) |
| Support phone | +1 407 620 7905 | keep — it is the LLC's number |
| Business website | `molivite.com` | keep (Stripe takes one URL); Afrinoble's is named in the description |
| Branding colours | Molivite purple `#873eff` / `#2c045d` | a neutral pair (charcoal + white) so Checkout, receipts and Link look right on both sites — or keep purple and accept it on Afrinoble |

With the prefix set to `GATUS`, the card statement reads per store:

- Afrinoble: `GATUS* AFRINOBLE` — `checkout.mjs` already sends the
  `AFRINOBLE` suffix on every session (and drops it if the prefix is too long).
- Molivite: `GATUS* MOLIVITE` — in WooCommerce → Stripe settings set the
  **shortened statement descriptor** to `MOLIVITE`. Until that is done
  Molivite charges read `GATUS LLC`, which is still the customer's counterparty.

The receipt header, the "Pay securely at …" Link line and hosted Payment
Link pages always show the account's public name — `Gatus LLC` once
changed — which is exactly what both sites tell the buyer to expect.

What Afrinoble stamps on the **order** itself (`checkout.mjs`): line item
"Afrinoble · <piece>", charge description "Afrinoble: <piece> — size",
`brand: afrinoble` metadata on the session and the payment, the suffix above,
a note under the Pay button, and a matching line on `/order/confirmed`. Filter
the Dashboard by that metadata (or by the `afrinoble-buy-now` integration
identifier) to see one store's orders on their own.

If the house later wants a fully separate name on receipts and Link, the clean
fix is a **second Stripe account named Afrinoble under the same login and the
same LLC** (account switcher → Create new account); then swap the two keys in
Netlify. Stripe allows one business to run several accounts.

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

# Stripe / checkout handoff — 2026-09-18

Branch: `claude/connected-stripe-details-3r8eh0` (not merged into main).
Everything below was done in one session; continue from "Still to do".
No secrets are in this file or anywhere in the repo — keys live only in
Netlify environment variables and the Stripe Dashboard.

## The setup, in one paragraph

Molivite and Afrinoble share ONE live Stripe account: **Gatus LLC**,
`acct_1SS3wIIiecUBjlGC`, legal entity Gatus Pharma LLC (single-member LLC,
Apopka FL), verified, charges and payouts enabled, weekly payouts to Truist.
There is also a second, never-activated account named **AFRINOBLE** under the
same login (with an "AFRINOBLE sandbox"). It is NOT used. If the Dashboard
shows "Activate payments" or a Sandbox banner, you are in the wrong place:
use the account switcher and pick Gatus LLC, live mode.

## Done — Stripe account (live)

- Created the Afrinoble fulfilment webhook endpoint
  `we_1UGtzMIiecUBjlGC78Aec8xF` →
  `https://afrinoble.netlify.app/.netlify/functions/stripe-webhook`,
  events `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`. Dashboard page:
  https://dashboard.stripe.com/webhooks/we_1UGtzMIiecUBjlGC78Aec8xF
- Archived the five pre-price-drop $120 Afrinoble products (Adaeze, Amara,
  Zola, Folasade, Chidinma). Active Afrinoble products are the five $75 ones;
  the five Payment Links in `src/data/products.js` point at those.
- Deactivated one stray Payment Link (`plink_1UDrHVIiecUBjlGClUrABUSz`,
  a second Chidinma link nothing referenced).
- Left Molivite's WooCommerce webhook (`we_1SS48tIiecUBjlGCFmZLuxuM`,
  stage.molivite.com) untouched.
- Molivite products unchanged: 1-Month $34.99 (`price_1U5OovIiecUBjlGCquhWsez8`),
  3-Month $94.47, 6-Month $167.95, each with a hosted Payment Link.

## Done — repo (this branch)

- `stripe/README.md`: webhook section now says the endpoint exists; new
  "one profile for both houses" section with the target Dashboard values.
- `molivite-backend/`: a self-contained, functions-only Netlify site for
  Stripe Embedded Checkout on molivite.com (Landingsite static site):
  `create-checkout-session`, `session-status`, `stripe-webhook`, shared
  `netlify/lib/http.js`, `netlify.toml` rewrites (`/create-checkout-session`,
  `/session-status`, `/stripe-webhook`), README, smoke test (`npm test`,
  passes). Not deployed anywhere yet.

## In progress — Dashboard public profile (done by hand, API cannot do it)

Settings → Business → Public details / Business details, on Gatus LLC LIVE:

| Field | Set to |
|---|---|
| Legal business name | `Gatus Pharma LLC` (no trailing period; leave as is) |
| Business name (DBA) | `Gatus LLC` |
| Statement descriptor | `GATUS LLC` |
| Shortened descriptor (prefix) | `GATUS` |
| Product description | "Gatus LLC runs two online stores: MoLivite (molivite.com), a 10-in-1 immune-support capsule sold in 1, 3 and 6 month supplies, and Afrinoble (afrinoble.netlify.app), made-to-measure African-inspired clothing and accessories. Customers are charged in full at checkout and orders ship within a few days; each receipt and card statement names the store." |
| Support email | one inbox read for both stores |
| Support URL | clear it, or a neutral contact page (was molivite.com) |
| Business website | molivite.com (Stripe takes one URL) |
| Industry | Other merchandise (fine) |

Last known state (before the user's edits): DBA "Gatus Pharma LLC",
descriptor `MOLIVITE.COM`, prefix `MOLIVITE.C`, no support email. Verify with
`GET /v1/accounts/acct_1SS3wIIiecUBjlGC` (the connector's `GetAccountsAccount`).
Result per store on card statements once the prefix is `GATUS`:
Afrinoble `GATUS* AFRINOBLE` (checkout.mjs sends the suffix);
Molivite `GATUS* MOLIVITE` (molivite-backend sends it; WooCommerce needs its
"shortened statement descriptor" set to `MOLIVITE` if that store stays).

## In progress — Afrinoble Netlify variables

Site: https://app.netlify.com/sites/afrinoble . The user first entered the
secret VALUES as variable NAMES (rows named `sk_live_…`, `whsec_…`, `mk_…`).
Those must be deleted and re-created as:

| Key | Value | Secret? |
|---|---|---|
| `STRIPE_SECRET_KEY` | a live **restricted** key (Checkout Sessions: write) — the old secret key was partly exposed in a screenshot and should be rolled | yes |
| `STRIPE_WEBHOOK_SECRET` | signing secret of `we_1UGtzMIiecUBjlGC78Aec8xF` (Reveal on its page) | yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | live `pk_live_…` | **no** (build must read it) |

Netlify UI gotcha: ticking "Contains secret values" locks scopes to
Builds/Functions/Runtime and forces "Different value for each deploy
context" — that is normal; paste the value into Production (and Deploy
Previews / Branch deploys), leave Local development empty. Then
Deploys → Trigger deploy → Clear cache and deploy site.

Verification (must be done from a browser — this Claude environment's
network policy blocks *.netlify.app and molivite.com):
1. `https://afrinoble.netlify.app/.netlify/functions/session-status?session_id=cs_probe`
   → `{"error":"bad_session"}` = secret key loaded; `not_configured` = missing.
2. Stripe endpoint page → Send test event `checkout.session.completed`
   → 200 = good; 503 = webhook secret missing; 400 = wrong value.
3. Real proof: buy one $75 piece, check the payment in Stripe, the 200
   delivery, and the JSON record in Netlify → Blobs → `orders`; then refund.

## Still to do

Afrinoble
- [ ] Netlify variables fixed as above, redeployed, probe returns `bad_session`.
- [ ] Webhook test event returns 200.
- [ ] One real order recorded in Netlify Blobs, then refunded.
- [ ] Dashboard → Settings → Notifications → "Successful payments" email on.
- [ ] Optional: `RESEND_API_KEY` + `ORDER_NOTIFY_EMAIL` in Netlify for order emails.

Molivite
- [ ] Deploy `molivite-backend/` as a NEW Netlify site (Base directory
      `molivite-backend`, no build command). Note the site URL.
- [ ] Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` there (test keys
      from the sandbox first if rehearsing; live keys to go live).
- [ ] Create a Stripe webhook endpoint for `https://<site>.netlify.app/stripe-webhook`
      with `checkout.session.completed`, `…async_payment_succeeded`,
      `…async_payment_failed`, `…expired`; put its secret in Netlify; redeploy.
      (Claude can create the endpoint via the Stripe connector once the URL is known.)
- [ ] Wire the Landingsite page per `molivite-backend/README.md` "Frontend contract".
- [ ] One test purchase, then switch to live keys.
- [ ] Decide whether the WooCommerce staging webhook is still needed.

Account / repo
- [ ] Confirm the Dashboard profile values took (re-read the account).
- [ ] Open a PR for this branch into main when ready (docs + molivite-backend).
- [ ] Optionally close the unused AFRINOBLE account so nobody switches into it.
- [ ] Before enabling `STRIPE_AUTOMATIC_TAX`, add Stripe Tax registrations.

## Things that bit us (so they don't again)

- "Only live keys can access this method" = you are in a sandbox/test mode.
- "Activate Payments / Let's start with your business type" = you are in the
  empty AFRINOBLE account, not Gatus LLC.
- Own-account business profile cannot be edited via API (Dashboard only).
- Default prices cannot be archived directly; archive the product instead.
- Netlify variable NAME must be e.g. `STRIPE_SECRET_KEY`; the key goes in VALUE.
- Never paste keys or unmasked screenshots of them into chat; the repo's
  `.githooks/pre-commit` blocks committing them.

# MoLivite checkout backend

Three Netlify Functions that put Stripe **Embedded Checkout** on the static
site at molivite.com. The site calls these over HTTPS; the price and product
are fixed here, server-side, so the browser can only choose a quantity.

| Path | Method | Function | Does |
|---|---|---|---|
| `/create-checkout-session` | POST | `create-checkout-session.js` | Creates an embedded Checkout Session, returns `{ clientSecret }` |
| `/session-status?session_id=…` | GET | `session-status.js` | Tells the confirmation page whether the session paid |
| `/stripe-webhook` | POST | `stripe-webhook.js` | Signature-checked record of paid / failed / expired checkouts |

The clean paths are rewrites in `netlify.toml`; the functions also answer at
`/.netlify/functions/<name>`.

## Environment variables

Set in Netlify → Site configuration → Environment variables. Never in the
repo, never in chat.

| Variable | What it is |
|---|---|
| `STRIPE_SECRET_KEY` | Server key. Prefer a **restricted key** (Developers → API keys → Create restricted key) with *Checkout Sessions: write*; a plain secret key also works. Mark it "Contains secret values". |
| `STRIPE_WEBHOOK_SECRET` | The endpoint's signing secret (`whsec_…`) from the step below. Secret. |

A function that starts without its variable fails at cold start with one
clear log line naming the variable (never its value). After changing a
variable, **Deploys → Trigger deploy**.

## Deploy

This folder is its own Netlify site. Either move it to its own repository, or
create a new site from this repo and set **Base directory** to
`molivite-backend` (Site configuration → Build settings). No build command is
needed; `netlify.toml` already points at `public/` and `netlify/functions/`.

Allowed browser origins are listed in `netlify/lib/http.js`
(`https://molivite.com`, `https://www.molivite.com`, `http://localhost:8888`).
Add any other domain the store is served from.

## Webhook (this is what records an order)

1. Dashboard → Developers → Webhooks → **Add endpoint**
2. URL: `https://<site>.netlify.app/stripe-webhook`
3. Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired`
4. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`, redeploy.
5. Send a test event from the endpoint page and check the function log for
   `ORDER PAID` (or a `signature rejected` line if the secret is wrong).

Fulfilment (email, 3PL, order sheet) goes in `fulfil()` at the bottom of
`stripe-webhook.js` — the comment block there lists the fields to use.

## Run locally

```bash
cd molivite-backend
npm install
npm test                    # smoke test: CORS, method and input checks, no Stripe calls
npx netlify-cli dev         # serves the functions at http://localhost:8888
```

Put the two variables in a local `.env` (git-ignored) or `netlify env:set`
against the linked site. To test the webhook locally:

```bash
stripe listen --forward-to localhost:8888/stripe-webhook
```

and use the `whsec_…` it prints as `STRIPE_WEBHOOK_SECRET` for that session.

## Frontend contract

```js
// 1. Ask for a session
const res = await fetch('https://<site>.netlify.app/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ id: 'molivite-1-month', quantity: 1 }],
    returnUrl: 'https://molivite.com/checkout?session_id={CHECKOUT_SESSION_ID}',
  }),
});
const { clientSecret } = await res.json();

// 2. Mount Stripe's form (Stripe.js loaded from https://js.stripe.com/v3)
const stripe = Stripe('pk_live_…');           // publishable key — public by design
const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
checkout.mount('#checkout');

// 3. On the return page
const { paid, email, amountTotal, quantity } =
  await (await fetch(`https://<site>.netlify.app/session-status?session_id=${id}`)).json();
```

## Notes

- **Shared Stripe account.** Molivite and Afrinoble sell from one account, so
  each payment carries a `MOLIVITE` card-statement suffix (rendered
  `<account prefix>* MOLIVITE`) and `product_id` metadata. If the account's
  prefix is too long for Stripe's 22-character limit the session is created
  without the suffix rather than failing the sale.
- **Tax** is off (`automatic_tax: { enabled: false }`). The comment in
  `create-checkout-session.js` says how to turn Stripe Tax on once a
  registration is collecting.
- **Errors** returned to the browser are fixed codes
  (`create-session-failed`, `session-status-failed`); Stripe's messages and
  the keys only ever appear in the Netlify function log.

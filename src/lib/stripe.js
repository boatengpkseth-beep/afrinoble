/**
 * Loads Stripe.js once, from Stripe's own host (a PCI requirement — it must
 * not be bundled). Resolves to the Stripe instance, or null when the site has
 * no publishable key configured, in which case checkout falls back to the
 * product's Payment Link.
 *
 * Netlify env: VITE_STRIPE_PUBLISHABLE_KEY (pk_test_… / pk_live_…) on the
 * site, STRIPE_SECRET_KEY on the functions.
 */
export const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || null

let loading = null

export function loadStripe() {
  if (!PUBLISHABLE_KEY) return Promise.resolve(null)
  if (window.Stripe) return Promise.resolve(window.Stripe(PUBLISHABLE_KEY))
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.async = true
      script.onload = () => resolve(window.Stripe ? window.Stripe(PUBLISHABLE_KEY) : null)
      script.onerror = () => reject(new Error('Stripe.js failed to load'))
      document.head.appendChild(script)
    })
  }
  return loading
}

/** Asks our Netlify function for an embedded Checkout Session. */
export async function createCheckoutSession({ slug, size, quantity = 1 }) {
  const res = await fetch('/.netlify/functions/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, size, quantity }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(body.message || body.error || `HTTP ${res.status}`)
    err.code = body.error
    throw err
  }
  return body.clientSecret
}

export async function fetchSessionStatus(sessionId) {
  const res = await fetch(`/.netlify/functions/session-status?session_id=${encodeURIComponent(sessionId)}`)
  if (!res.ok) return null
  return res.json()
}

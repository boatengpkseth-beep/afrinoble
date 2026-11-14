/**
 * Which browser origins may call the functions. Kept apart from http.js so
 * code that never talks to Stripe (the partner programme) can use it without
 * needing a Stripe key.
 */

/**
 * Origins allowed to call the browser-facing functions. The store itself,
 * its www alias, and Netlify Dev for local testing. Anything else gets the
 * canonical origin back, which the browser then refuses.
 */
export const ALLOWED_ORIGINS = new Set([
  'https://molivite.com',
  'https://www.molivite.com',
  // Preview address of the redesigned storefront (repo molivite-site).
  'https://molivite-storefront.netlify.app',
  'http://localhost:8888',
]);

/** The request's Origin header, however Netlify cased it. */
export function originOf(event) {
  return event.headers?.origin ?? event.headers?.Origin ?? '';
}

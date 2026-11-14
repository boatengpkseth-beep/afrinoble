/**
 * Shared plumbing for the browser-facing functions: the Stripe client,
 * the CORS allow-list and JSON responses. Kept out of netlify/functions so
 * Netlify does not try to deploy it as a function of its own.
 */
import Stripe from 'stripe';

/**
 * Fails loudly at cold start when a secret is missing, so a misconfigured
 * deploy shows up in the function log as one clear line instead of as a
 * confusing Stripe authentication error later. Only the NAME is ever logged.
 */
export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        'Set it in Netlify → Site configuration → Environment variables, then redeploy.',
    );
  }
  return value;
}

/** One Stripe client per function instance. The key never leaves process.env. */
export const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
  appInfo: { name: 'molivite-netlify-checkout', version: '1.0.0' },
});

export { ALLOWED_ORIGINS, originOf } from './origins.js';
import { ALLOWED_ORIGINS, originOf } from './origins.js';

export function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://molivite.com',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
    body: JSON.stringify(body),
  };
}

/** 204 for the CORS preflight. */
export function preflight(event) {
  return { statusCode: 204, headers: corsHeaders(originOf(event)), body: '' };
}

/** 405 with the Allow header the spec expects. */
export function methodNotAllowed(event, allow) {
  return json(405, { error: 'method-not-allowed' }, { ...corsHeaders(originOf(event)), Allow: allow });
}

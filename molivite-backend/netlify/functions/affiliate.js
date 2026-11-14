/**
 * The partner programme's HTTP surface. One function, four routes:
 *
 *   POST /affiliate/apply      public   save an application
 *   POST /affiliate/click      public   count a visit on a partner link
 *   GET  /affiliate/dashboard  partner  ?code=..&key=..  their own numbers
 *   POST /affiliate/admin      owner    Authorization: Bearer <AFFILIATE_ADMIN_KEY>
 *
 * Written in Netlify's current function format (a Request in, a Response
 * out) because that is the format in which the Blobs store can be read with
 * strong consistency: an approval must be visible to the very next call.
 *
 * The admin key is read from the environment on every call, so the route is
 * simply closed (503) until the key has been set in Netlify.
 */
import { ALLOWED_ORIGINS } from '../lib/origins.js';
import { admin, apply, click, dashboard, sameSecret } from '../lib/affiliates.js';

export const config = { path: '/affiliate/*' };

function cors(req) {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://molivite.com',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const reply = (req, status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(req) } });

async function parse(req) {
  try {
    const raw = await req.text();
    if (raw.length > 20_000) return null;
    const value = JSON.parse(raw || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
  const url = new URL(req.url);
  const route = url.pathname.replace(/\/+$/, '').split('/').pop();

  try {
    if (route === 'dashboard') {
      if (req.method !== 'GET') return reply(req, 405, { error: 'method-not-allowed' });
      const data = await dashboard(null, url.searchParams.get('code'), url.searchParams.get('key'));
      // One answer for "no such partner" and "wrong key", so codes cannot be probed.
      return data ? reply(req, 200, data) : reply(req, 404, { error: 'not-found' });
    }

    if (req.method !== 'POST') return reply(req, 405, { error: 'method-not-allowed' });
    const body = await parse(req);
    if (!body) return reply(req, 400, { error: 'invalid-json' });

    if (route === 'apply') {
      const out = await apply(null, body);
      return reply(req, out.error ? 400 : 200, out);
    }
    if (route === 'click') return reply(req, 200, await click(null, body.code));

    if (route === 'admin') {
      const expected = process.env.AFFILIATE_ADMIN_KEY;
      if (!expected) return reply(req, 503, { error: 'admin-not-configured' });
      const given = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
      if (!sameSecret(given, expected)) return reply(req, 401, { error: 'unauthorised' });
      const out = await admin(null, body);
      return reply(req, out.error ? 400 : 200, out);
    }

    return reply(req, 404, { error: 'not-found' });
  } catch (err) {
    console.error('affiliate failed:', route, err?.message ?? err);
    return reply(req, 500, { error: 'affiliate-failed' });
  }
};

/**
 * The partner programme's HTTP surface. One function, four routes:
 *
 *   POST /affiliate/apply      public   save an application
 *   POST /affiliate/click      public   count a visit on a partner link
 *   GET  /affiliate/dashboard  partner  ?code=..&key=..  their own numbers
 *   POST /affiliate/admin      owner    Authorization: Bearer <AFFILIATE_ADMIN_KEY>
 *
 * The admin key is read from the environment on every call, so the route is
 * simply closed (503) until the key has been set in Netlify.
 */
import { ALLOWED_ORIGINS, originOf } from '../lib/origins.js';
import { admin, apply, click, dashboard, sameSecret } from '../lib/affiliates.js';

function cors(event) {
  const origin = originOf(event);
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://molivite.com',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const reply = (event, statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(event) },
  body: JSON.stringify(body),
});

function parse(event) {
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf8') : event.body ?? '';
    if (raw.length > 20_000) return null;
    const value = JSON.parse(raw || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors(event), body: '' };
  const route = (event.path ?? '').replace(/\/+$/, '').split('/').pop();

  try {
    if (route === 'dashboard') {
      if (event.httpMethod !== 'GET') return reply(event, 405, { error: 'method-not-allowed' });
      const q = event.queryStringParameters ?? {};
      const data = await dashboard(event, q.code, q.key);
      // One answer for "no such partner" and "wrong key", so codes cannot be probed.
      return data ? reply(event, 200, data) : reply(event, 404, { error: 'not-found' });
    }

    if (event.httpMethod !== 'POST') return reply(event, 405, { error: 'method-not-allowed' });
    const body = parse(event);
    if (!body) return reply(event, 400, { error: 'invalid-json' });

    if (route === 'apply') {
      const out = await apply(event, body);
      return reply(event, out.error ? 400 : 200, out);
    }
    if (route === 'click') return reply(event, 200, await click(event, body.code));

    if (route === 'admin') {
      const expected = process.env.AFFILIATE_ADMIN_KEY;
      if (!expected) return reply(event, 503, { error: 'admin-not-configured' });
      const header = event.headers?.authorization ?? event.headers?.Authorization ?? '';
      if (!sameSecret(header.replace(/^Bearer\s+/i, ''), expected)) return reply(event, 401, { error: 'unauthorised' });
      const out = await admin(event, body);
      return reply(event, out.error ? 400 : 200, out);
    }

    return reply(event, 404, { error: 'not-found' });
  } catch (err) {
    console.error('affiliate failed:', route, err?.message ?? err);
    return reply(event, 500, { error: 'affiliate-failed' });
  }
};

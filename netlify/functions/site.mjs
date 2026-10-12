import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';
import worker from '../../worker/index.js';

export const config = { path: '/*', preferStatic: false };

export function bucketFor(store) {
  return {
    async list({ prefix }) {
      const { blobs } = await store.list({ prefix });
      return { objects: blobs.map(({ key }) => ({ key })) };
    },
    async get(key) {
      const value = await store.get(key, { type: 'text' });
      return value === null ? null : { json: async () => JSON.parse(value) };
    },
    async put(key, value) { await store.set(key, value); },
  };
}

function moderator(request, password) {
  if (!password) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  try {
    const value = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const supplied = Buffer.from(value.slice(value.indexOf(':') + 1));
    const expected = Buffer.from(password);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  } catch { return false; }
}

export async function handle(request, store, password = process.env.VIBODROME_ADMIN_PASSWORD) {
  const url = new URL(request.url);
  if (url.pathname === '/admin' || url.pathname === '/api/review') {
    if (!password) return new Response('Moderator access is not configured yet. Set VIBODROME_ADMIN_PASSWORD in Netlify environment variables and redeploy.', { status: 503 });
    if (!moderator(request, password)) return new Response('Moderator sign-in required.', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Vibodrome review queue", charset="UTF-8"', 'Cache-Control': 'no-store' } });
  }
  if (request.method === 'POST' && request.headers.get('origin') && request.headers.get('origin') !== url.origin) return new Response('Invalid request origin.', { status: 403 });
  const headers = new Headers(request.headers);
  headers.delete('oai-authenticated-user-id');
  headers.delete('oai-authenticated-user-email');
  if (moderator(request, password)) headers.set('oai-authenticated-user-id', 'netlify-moderator');
  const forwarded = new Request(request, { headers });
  const response = await worker.fetch(forwarded, { BUCKET: bucketFor(store) });
  const outputHeaders = new Headers(response.headers);
  outputHeaders.set('Cache-Control', url.pathname.startsWith('/media/') ? 'public,max-age=86400' : 'no-store');
  const type = response.headers.get('content-type') || '';
  if (type.includes('text/html') || type.includes('application/xml')) {
    const siteOrigin = process.env.SITE_URL || url.origin;
    const text = (await response.text()).replaceAll('https://vibodrome.artificialtv.chatgpt.site', siteOrigin);
    return new Response(text, { status: response.status, headers: outputHeaders });
  }
  return new Response(response.body, { status: response.status, headers: outputHeaders });
}

export default async function site(request) {
  try {
    const store = getStore({ name: 'vibodrome-submissions', consistency: 'strong' });
    return await handle(request, store);
  } catch (error) {
    console.error('Vibodrome request failed:', error.message);
    return new Response('The site is temporarily unavailable. Please try again shortly.', { status: 503 });
  }
}

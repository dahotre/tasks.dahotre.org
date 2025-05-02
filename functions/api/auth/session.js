import { createJsonResponse, createErrorResponse } from '../tasks/utils';
import { verify } from '@tsndr/cloudflare-worker-jwt';

const JWT_SECRET = 'REPLACE_ME_WITH_A_SECRET'; // Set this securely in production

function getTokenFromCookie(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function onRequestGet({ request }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) {
      console.warn('[SESSION] No token in cookie');
      return createErrorResponse('Not authenticated', null, 401);
    }
    const { payload, valid } = await verify(token, JWT_SECRET);
    if (!valid) {
      console.warn('[SESSION] Invalid token');
      throw new Error('Invalid token');
    }
    console.log(`[SESSION] Valid session for user: ${payload.email}`);
    return createJsonResponse({ user: { id: payload.id, email: payload.email } });
  } catch (err) {
    console.error('[SESSION] Error:', err);
    return createErrorResponse('Not authenticated', err.message, 401);
  }
} 
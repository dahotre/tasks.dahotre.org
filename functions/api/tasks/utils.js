import { verify } from '@tsndr/cloudflare-worker-jwt';

export function getIdFromUrl(url) {
  const match = url.pathname.match(/\/tasks\/(\d+)/);
  return match ? match[1] : null;
}

export function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status
  });
}

export function createErrorResponse(message, details = null, status = 500) {
  const error = { error: message };
  if (details) error.details = details;
  return createJsonResponse(error, status);
}

export function getTokenFromCookie(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function verifyUserFromRequest(request, env) {
  const JWT_SECRET = env.JWT_SECRET;
  const token = getTokenFromCookie(request);
  if (!token) {
    console.warn('[AUTH] No token in cookie');
    return null;
  }
  const payload = await verify(token, JWT_SECRET);
  if (!payload) {
    console.warn('[AUTH] Invalid token');
    return null;
  }
  return payload;
} 
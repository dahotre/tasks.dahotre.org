import { verify, sign } from '@tsndr/cloudflare-worker-jwt';

const JWT_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days in seconds

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

export async function issueJwtAndSetCookie({ user, env, status = 200, responseData = null }) {
  const JWT_SECRET = env.JWT_SECRET;
  const payload = { id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN };
  const token = await sign(payload, JWT_SECRET);
  const response = createJsonResponse(responseData || { user: { id: user.id, email: user.email } }, status);
  response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${JWT_EXPIRES_IN}; SameSite=Strict`);
  return response;
} 
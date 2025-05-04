import { getTokenFromCookie, verifyUserFromRequest } from '../tasks/utils';
import { createJsonResponse, createErrorResponse } from '../tasks/utils';
import { verify } from '@tsndr/cloudflare-worker-jwt';

export async function onRequestGet({ request, env }) {
  try {
    // Use shared utility for authentication
    const user = await verifyUserFromRequest(request, env);
    if (!user) {
      console.warn('[SESSION] Not authenticated');
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    console.log(`[SESSION] Valid session for user: ${user.email}`);
    return new Response(JSON.stringify({ user: { id: user.id, email: user.email } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[SESSION] Error:', err);
    return new Response(JSON.stringify({ error: 'Session error', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

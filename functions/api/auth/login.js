import { createJsonResponse, createErrorResponse } from '../tasks/utils';
import bcrypt from 'bcryptjs';
import { sign } from '@tsndr/cloudflare-worker-jwt';

const JWT_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days in seconds

export async function onRequestPost({ request, env }) {
  const JWT_SECRET = env.JWT_SECRET;
  let email;
  try {
    const body = await request.json();
    email = body.email;
    if (!email || !body.password) {
      console.warn('[LOGIN] Missing email or password');
      return createErrorResponse('Email and password are required.', null, 400);
    }
    console.log(`[LOGIN] Attempt for email: ${email}`);
    // Find user
    const { results } = await env.DB.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').bind(email).all();
    const user = results[0];
    if (!user) {
      console.warn(`[LOGIN] Invalid email: ${email}`);
      return createErrorResponse('Invalid email or password.', null, 401);
    }
    // Compare password
    const valid = await bcrypt.compare(body.password, user.password_hash);
    if (!valid) {
      console.warn(`[LOGIN] Invalid password for email: ${email}`);
      return createErrorResponse('Invalid email or password.', null, 401);
    }
    // Create JWT
    console.log('[DEBUG] typeof JWT_SECRET:', typeof JWT_SECRET, 'value:', JWT_SECRET);
    const payload = { id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN };
    console.log('[LOGIN] Creating JWT with:', { payload, secret: JWT_SECRET });
    const token = await sign(payload, JWT_SECRET);
    console.log('[LOGIN] Created JWT token:', token);
    // Set cookie
    const response = createJsonResponse({ user: { id: user.id, email: user.email } });
    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${JWT_EXPIRES_IN}; SameSite=Strict`);
    console.log(`[LOGIN] Success for email: ${email}`);
    return response;
  } catch (err) {
    console.error(`[LOGIN] Error for email ${email}:`, err);
    return createErrorResponse('Failed to log in', err.message);
  }
} 
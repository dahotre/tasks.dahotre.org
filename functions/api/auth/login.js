import { createJsonResponse, createErrorResponse, issueJwtAndSetCookie } from '../tasks/utils';
import bcrypt from 'bcryptjs';

const JWT_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days in seconds

export async function onRequestPost({ request, env }) {
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
    // Issue JWT and set cookie
    return await issueJwtAndSetCookie({ user, env });
  } catch (err) {
    console.error(`[LOGIN] Error for email ${email}:`, err);
    return createErrorResponse('Failed to log in', err.message);
  }
} 
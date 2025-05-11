import { createJsonResponse, createErrorResponse, issueJwtAndSetCookie } from '../tasks/utils';
import bcrypt from 'bcryptjs';

export async function onRequestPost({ request, env }) {
  let email;
  try {
    const body = await request.json();
    email = body.email;
    if (!email || !body.password) {
      console.warn('[REGISTER] Missing email or password');
      return createErrorResponse('Email and password are required.', null, 400);
    }
    console.log(`[REGISTER] Attempt for email: ${email}`);
    // Check if user already exists
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).all();
    if (existing.results.length > 0) {
      console.warn(`[REGISTER] Duplicate email: ${email}`);
      return createErrorResponse('Email already registered.', null, 409);
    }
    // Hash password
    const password_hash = await bcrypt.hash(body.password, 10);
    // Insert user
    const { results } = await env.DB.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id, email').bind(email, password_hash).all();
    console.log(`[REGISTER] User registered: ${email}`);
    // Issue JWT and set cookie, with 201 status
    return await issueJwtAndSetCookie({ user: results[0], env, status: 201 });
  } catch (err) {
    console.error(`[REGISTER] Error for email ${email}:`, err);
    return createErrorResponse('Failed to register user', err.message);
  }
} 
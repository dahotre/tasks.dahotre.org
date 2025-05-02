import { createJsonResponse } from '../tasks/utils';

export async function onRequestPost() {
  console.log('[LOGOUT] Logging out user (clearing token cookie)');
  // Clear the token cookie by setting it to empty and expired
  const response = createJsonResponse({ message: 'Logged out' });
  response.headers.set('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
  return response;
} 
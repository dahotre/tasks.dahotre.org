import { describe, test, expect, vi, beforeEach } from 'vitest';
import { onRequestPost as register } from '../../functions/api/auth/register.js';
import { onRequestPost as login } from '../../functions/api/auth/login.js';
import { onRequestGet as session } from '../../functions/api/auth/session.js';
import { onRequestPost as logout } from '../../functions/api/auth/logout.js';
import bcrypt from 'bcryptjs';
import { sign, verify } from '@tsndr/cloudflare-worker-jwt';

vi.mock('bcryptjs');
vi.mock('@tsndr/cloudflare-worker-jwt');

const mockDB = {
  prepare: vi.fn()
};
const mockEnv = { DB: mockDB };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('/api/auth/register', () => {
  test('registers a new user', async () => {
    mockDB.prepare.mockImplementationOnce(() => ({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    })) // No existing user
    .mockImplementationOnce(() => ({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [{ id: 1, email: 'a@b.com' }] }) })
    })); // Inserted user
    bcrypt.hash.mockResolvedValue('hashedpw');

    const request = { json: async () => ({ email: 'a@b.com', password: 'pw' }) };
    const response = await register({ request, env: mockEnv });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.user).toEqual({ id: 1, email: 'a@b.com' });
  });

  test('rejects duplicate email', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [{ id: 1 }] }) })
    });
    const request = { json: async () => ({ email: 'a@b.com', password: 'pw' }) };
    const response = await register({ request, env: mockEnv });
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toMatch(/already registered/i);
  });

  test('rejects missing fields', async () => {
    const request = { json: async () => ({ email: '' }) };
    const response = await register({ request, env: mockEnv });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/required/i);
  });
});

describe('/api/auth/login', () => {
  test('logs in with correct credentials', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [{ id: 1, email: 'a@b.com', password_hash: 'hashedpw' }] }) })
    });
    bcrypt.compare.mockResolvedValue(true);
    sign.mockResolvedValue('jwt-token');
    const request = { json: async () => ({ email: 'a@b.com', password: 'pw' }) };
    const response = await login({ request, env: mockEnv });
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toMatch(/token=jwt-token/);
    const data = await response.json();
    expect(data.user).toEqual({ id: 1, email: 'a@b.com' });
  });

  test('rejects invalid password', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [{ id: 1, email: 'a@b.com', password_hash: 'hashedpw' }] }) })
    });
    bcrypt.compare.mockResolvedValue(false);
    const request = { json: async () => ({ email: 'a@b.com', password: 'wrong' }) };
    const response = await login({ request, env: mockEnv });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toMatch(/invalid/i);
  });

  test('rejects non-existent user', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    });
    const request = { json: async () => ({ email: 'no@user.com', password: 'pw' }) };
    const response = await login({ request, env: mockEnv });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toMatch(/invalid/i);
  });

  test('rejects missing fields', async () => {
    const request = { json: async () => ({ email: '' }) };
    const response = await login({ request, env: mockEnv });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/required/i);
  });
});

describe('/api/auth/session', () => {
  const sessionEnv = { JWT_SECRET: 'test-secret' };
  test('returns user if JWT is valid in cookie', async () => {
    verify.mockResolvedValue({ payload: { id: 1, email: 'a@b.com' } });
    const request = { headers: { get: (h) => h === 'cookie' ? 'token=valid.jwt.token' : '' } };
    const response = await session({ request, env: sessionEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user).toEqual({ id: 1, email: 'a@b.com' });
  });

  test('returns 401 if no cookie', async () => {
    const request = { headers: { get: () => '' } };
    const response = await session({ request, env: sessionEnv });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toMatch(/not authenticated/i);
  });

  test('returns 401 if JWT is invalid', async () => {
    verify.mockResolvedValue(false);
    const request = { headers: { get: (h) => h === 'cookie' ? 'token=bad.jwt.token' : '' } };
    const response = await session({ request, env: sessionEnv });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toMatch(/not authenticated/i);
  });
});

describe('/api/auth/logout', () => {
  test('clears the token cookie', async () => {
    const response = await logout();
    expect(response.status).toBe(200);
    expect(response.headers.get('Set-Cookie')).toMatch(/token=;/);
    const data = await response.json();
    expect(data.message).toMatch(/logged out/i);
  });
}); 
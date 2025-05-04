import { onRequestGet, onRequestPost } from './tasks';
import { onRequestGet as onRequestGetId, onRequestPut, onRequestPatch, onRequestDelete } from './tasks/[id]';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { verify } from '@tsndr/cloudflare-worker-jwt';

const mockDB = {
  prepare: vi.fn()
};

const mockEnv = { 
    DB: mockDB,
    JWT_SECRET: 'test-secret'
};

vi.mock('@tsndr/cloudflare-worker-jwt', () => ({
  verify: vi.fn(),
}));

// Helper to create a mock request with headers.get, preserving all other properties
function mockRequestWithHeaders(base = {}, cookieValue = 'token=valid.jwt.token') {
  return {
    ...base,
    headers: {
      get: (header) => (header === 'cookie' ? cookieValue : ''),
      ...(base.headers || {}),
    },
  };
}

describe('/api/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET returns tasks', async () => {
    verify.mockResolvedValue({ payload: { id: 42 }, valid: true });
    const mockResults = { results: [{ id: 1, title: 'Test', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 0, user_id: 42 }] };
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue(mockResults) })
    });
    const request = mockRequestWithHeaders({});
    const response = await onRequestGet({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockResults.results);
  });

  test('GET handles DB error', async () => {
    verify.mockResolvedValue({ payload: { id: 42 }, valid: true });
    mockDB.prepare.mockImplementation(() => { throw new Error('DB error'); });
    const request = mockRequestWithHeaders({});
    const response = await onRequestGet({ request, env: mockEnv });
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch tasks');
  });

  test('POST creates a task', async () => {
    verify.mockResolvedValue({ payload: { id: 42 }, valid: true });
    const mockTask = { id: 1, title: 'New Task', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 0, user_id: 42 };
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [mockTask] }) })
    });
    const request = mockRequestWithHeaders({
      json: async () => ({ title: 'New Task', due_date: '2025-01-01', quadrant: 'important-urgent' })
    });
    const response = await onRequestPost({ request, env: mockEnv });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toEqual(mockTask);
  });

  test('POST validates required fields', async () => {
    const request = mockRequestWithHeaders({
      json: async () => ({ due_date: '2025-01-01', quadrant: 'important-urgent' }) // missing title
    });
    const response = await onRequestPost({ request, env: mockEnv });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/required/);
  });

  test('POST handles DB error', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockRejectedValue(new Error('DB error')) })
    });
    const request = mockRequestWithHeaders({
      json: async () => ({ title: 'New Task', due_date: '2025-01-01', quadrant: 'important-urgent' })
    });
    const response = await onRequestPost({ request, env: mockEnv });
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to create task');
  });
});

describe.skip('/api/tasks/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET by id returns a task', async () => {
    verify.mockResolvedValue({ id: 42 });
    const mockTask = { id: 1, title: 'Test', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 0, user_id: 42 };
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({
        all: vi.fn()
          .mockResolvedValueOnce({ results: [{ user_id: 42 }] }) // ownership check
          .mockResolvedValueOnce({ results: [mockTask] }) // fetch result
      })
    });
    const request = mockRequestWithHeaders({ url: 'http://localhost/api/tasks/1' });
    const response = await onRequestGetId({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockTask);
  });

  test('GET by id returns 404 if not found', async () => {
    verify.mockResolvedValue({ id: 42 });
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    });
    const request = mockRequestWithHeaders({ url: 'http://localhost/api/tasks/999' });
    const response = await onRequestGetId({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });

  test('PUT updates a task', async () => {
    verify.mockResolvedValue({ id: 42 });
    const mockTask = { id: 1, title: 'Updated', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 1, user_id: 42 };
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({
        all: vi.fn()
          .mockResolvedValueOnce({ results: [{ user_id: 42 }] }) // ownership check
          .mockResolvedValueOnce({ results: [mockTask] }) // update result
      })
    });
    const request = mockRequestWithHeaders({
      url: 'http://localhost/api/tasks/1',
      json: async () => ({ title: 'Updated', due_date: '2025-01-01', quadrant: 'important-urgent', completed: true })
    });
    const response = await onRequestPut({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockTask);
  });

  test('PUT returns 404 if not found', async () => {
    verify.mockResolvedValue({ id: 42 });
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    });
    const request = mockRequestWithHeaders({
      url: 'http://localhost/api/tasks/999',
      json: async () => ({ title: 'Updated', due_date: '2025-01-01', quadrant: 'important-urgent', completed: true })
    });
    const response = await onRequestPut({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });

  test('PATCH updates fields of a task', async () => {
    verify.mockResolvedValue({ id: 42 });
    const mockTask = { id: 1, title: 'Test', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 1, user_id: 42 };
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({
        all: vi.fn()
          .mockResolvedValueOnce({ results: [{ user_id: 42 }] }) // ownership check
          .mockResolvedValueOnce({ results: [mockTask] }) // patch result
      })
    });
    const request = mockRequestWithHeaders({
      url: 'http://localhost/api/tasks/1',
      json: async () => ({ completed: true })
    });
    const response = await onRequestPatch({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockTask);
  });

  test('PATCH returns 404 if not found', async () => {
    verify.mockResolvedValue({ id: 42 });
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    });
    const request = mockRequestWithHeaders({
      url: 'http://localhost/api/tasks/999',
      json: async () => ({ completed: true })
    });
    const response = await onRequestPatch({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });

  test('DELETE removes a task', async () => {
    verify.mockResolvedValue({ id: 42 });
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({
        all: vi.fn()
          .mockResolvedValueOnce({ results: [{ user_id: 42 }] }) // ownership check
          .mockResolvedValueOnce({ results: [{ id: 1 }] }) // delete result
      })
    });
    const request = mockRequestWithHeaders({ url: 'http://localhost/api/tasks/1' });
    const response = await onRequestDelete({ request, env: mockEnv });
    expect(response.status).toBe(204);
  });

  test('DELETE returns 404 if not found', async () => {
    verify.mockResolvedValue({ id: 42 });
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    });
    const request = mockRequestWithHeaders({ url: 'http://localhost/api/tasks/999' });
    const response = await onRequestDelete({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });
}); 
import { onRequestGet, onRequestPost, onRequestGetId, onRequestPut, onRequestPatch, onRequestDelete } from './tasks';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockDB = {
  prepare: vi.fn()
};

const mockEnv = { DB: mockDB };

describe('/api/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET returns tasks', async () => {
    const mockResults = { results: [{ id: 1, title: 'Test', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 0 }] };
    mockDB.prepare.mockReturnValue({
      all: vi.fn().mockResolvedValue(mockResults)
    });

    const response = await onRequestGet({ env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockResults.results);
  });

  test('GET handles DB error', async () => {
    mockDB.prepare.mockImplementation(() => { throw new Error('DB error'); });

    const response = await onRequestGet({ env: mockEnv });
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch tasks');
  });

  test('POST creates a task', async () => {
    const mockRun = vi.fn().mockResolvedValue({});
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: mockRun })
    });

    const request = {
      json: async () => ({ title: 'New Task', due_date: '2025-01-01', quadrant: 'important-urgent' })
    };

    const response = await onRequestPost({ request, env: mockEnv });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('Task created');
  });

  test('POST validates required fields', async () => {
    const request = {
      json: async () => ({ due_date: '2025-01-01', quadrant: 'important-urgent' }) // missing title
    };

    const response = await onRequestPost({ request, env: mockEnv });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/required/);
  });

  test('POST handles DB error', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockRejectedValue(new Error('DB error')) })
    });

    const request = {
      json: async () => ({ title: 'New Task', due_date: '2025-01-01', quadrant: 'important-urgent' })
    };

    const response = await onRequestPost({ request, env: mockEnv });
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to create task');
  });
});

describe('/api/tasks/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('GET by id returns a task', async () => {
    const mockResults = { results: [{ id: 1, title: 'Test', due_date: '2025-01-01', quadrant: 'important-urgent', completed: 0 }] };
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue(mockResults) })
    });
    const request = { url: 'http://localhost/api/tasks/1' };
    const response = await onRequestGetId({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockResults.results[0]);
  });

  test('GET by id returns 404 if not found', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ all: vi.fn().mockResolvedValue({ results: [] }) })
    });
    const request = { url: 'http://localhost/api/tasks/999' };
    const response = await onRequestGetId({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });

  test('PUT updates a task', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ changes: 1 }) })
    });
    const request = {
      url: 'http://localhost/api/tasks/1',
      json: async () => ({ title: 'Updated', due_date: '2025-01-01', quadrant: 'important-urgent', completed: true })
    };
    const response = await onRequestPut({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Task updated');
  });

  test('PUT returns 404 if not found', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ changes: 0 }) })
    });
    const request = {
      url: 'http://localhost/api/tasks/999',
      json: async () => ({ title: 'Updated', due_date: '2025-01-01', quadrant: 'important-urgent', completed: true })
    };
    const response = await onRequestPut({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });

  test('PATCH updates fields of a task', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ changes: 1 }) })
    });
    const request = {
      url: 'http://localhost/api/tasks/1',
      json: async () => ({ completed: true })
    };
    const response = await onRequestPatch({ request, env: mockEnv });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Task updated');
  });

  test('PATCH returns 404 if not found', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ changes: 0 }) })
    });
    const request = {
      url: 'http://localhost/api/tasks/999',
      json: async () => ({ completed: true })
    };
    const response = await onRequestPatch({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });

  test('DELETE removes a task', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ changes: 1 }) })
    });
    const request = { url: 'http://localhost/api/tasks/1' };
    const response = await onRequestDelete({ request, env: mockEnv });
    expect(response.status).toBe(204);
  });

  test('DELETE returns 404 if not found', async () => {
    mockDB.prepare.mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ changes: 0 }) })
    });
    const request = { url: 'http://localhost/api/tasks/999' };
    const response = await onRequestDelete({ request, env: mockEnv });
    expect(response.status).toBe(404);
  });
}); 
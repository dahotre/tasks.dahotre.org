import '@testing-library/jest-dom';
import { vi } from 'vitest';

// In-memory tasks array for stateful mocking
let tasks = [];
let idCounter = 1;

global.fetch = vi.fn(async (url, options = {}) => {
  if (typeof url === 'string' && url.includes('/api/tasks')) {
    // GET /api/tasks
    if (!options.method || options.method === 'GET') {
      return Promise.resolve({
        json: () => Promise.resolve([...tasks]),
        status: 200,
      });
    }
    // POST /api/tasks (add new task)
    if (options.method === 'POST') {
      const body = JSON.parse(options.body);
      const newTask = {
        id: idCounter++,
        title: body.title,
        due: body.due_date || '',
        due_date: body.due_date || '',
        quadrant: body.quadrant,
        completed: false,
      };
      tasks.push(newTask);
      return Promise.resolve({
        json: () => Promise.resolve(newTask),
        status: 201,
      });
    }
    // PUT /api/tasks/:id (edit task)
    if (options.method === 'PUT' || options.method === 'PATCH') {
      const body = JSON.parse(options.body);
      tasks = tasks.map(t =>
        t.id === (body.id || (url.match(/\/api\/tasks\/(\d+)/) && parseInt(url.match(/\/api\/tasks\/(\d+)/)[1], 10)))
          ? {
              ...t,
              title: body.title,
              due: body.due_date || '',
              due_date: body.due_date || '',
              quadrant: body.quadrant || t.quadrant,
              completed: body.completed !== undefined ? body.completed : t.completed,
            }
          : t
      );
      return Promise.resolve({
        json: () => Promise.resolve(body),
        status: 200,
      });
    }
    // DELETE /api/tasks/:id
    if (options.method === 'DELETE') {
      const idMatch = url.match(/\/api\/tasks\/(\d+)/);
      if (idMatch) {
        const id = parseInt(idMatch[1], 10);
        tasks = tasks.filter(t => t.id !== id);
      }
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'deleted' }),
        status: 200,
      });
    }
  }
  // fallback for other URLs
  return Promise.resolve({
    json: () => Promise.resolve({}),
    status: 200,
  });
});

// Reset tasks before each test
beforeEach(() => {
  tasks = [];
  idCounter = 1;
}); 
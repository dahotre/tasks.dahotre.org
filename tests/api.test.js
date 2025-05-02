import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '../functions/api/tasks/index.js';
import { GET as getTask, PUT, DELETE, PATCH } from '../functions/api/tasks/[id].js';
import { cleanDb, createTestTask, createTestUser, TEST_USER_ID } from './helpers.js';

describe('Tasks API', () => {
  beforeEach(async () => {
    await cleanDb();
    await createTestUser();
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await GET();
      const tasks = await response.json();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks for the user', async () => {
      const task = await createTestTask();
      const response = await GET();
      const tasks = await response.json();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(task.id);
      expect(tasks[0].user_id).toBe(TEST_USER_ID);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        quadrant: 'urgent-important',
        due_date: '2025-01-01'
      };

      const response = await POST({
        request: new Request('http://localhost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        })
      });

      const task = await response.json();
      expect(task.title).toBe(taskData.title);
      expect(task.quadrant).toBe(taskData.quadrant);
      expect(task.due_date).toBe(taskData.due_date);
      expect(task.user_id).toBe(TEST_USER_ID);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 404 for non-existent task', async () => {
      const response = await getTask({
        params: { id: 999999 }
      });
      expect(response.status).toBe(404);
    });

    it('should return task by id', async () => {
      const task = await createTestTask();
      const response = await getTask({
        params: { id: task.id }
      });
      const fetchedTask = await response.json();
      expect(fetchedTask.id).toBe(task.id);
      expect(fetchedTask.user_id).toBe(TEST_USER_ID);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task', async () => {
      const task = await createTestTask();
      const updates = {
        title: 'Updated Task',
        quadrant: 'not-urgent-important',
        due_date: '2025-02-01',
        completed: true
      };

      const response = await PUT({
        params: { id: task.id },
        request: new Request('http://localhost', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
      });

      const updatedTask = await response.json();
      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.quadrant).toBe(updates.quadrant);
      expect(updatedTask.due_date).toBe(updates.due_date);
      expect(updatedTask.completed).toBe(1);
      expect(updatedTask.user_id).toBe(TEST_USER_ID);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await PUT({
        params: { id: 999999 },
        request: new Request('http://localhost', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Task',
            quadrant: 'not-urgent-important',
            due_date: '2025-02-01',
            completed: true
          })
        })
      });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task', async () => {
      const task = await createTestTask();
      const response = await DELETE({
        params: { id: task.id }
      });
      expect(response.status).toBe(200);

      // Verify task is deleted
      const getResponse = await getTask({
        params: { id: task.id }
      });
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await DELETE({
        params: { id: 999999 }
      });
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should partially update task', async () => {
      const task = await createTestTask();
      const updates = {
        title: 'Partially Updated Task'
      };

      const response = await PATCH({
        params: { id: task.id },
        request: new Request('http://localhost', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
      });

      const updatedTask = await response.json();
      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.quadrant).toBe(task.quadrant); // Unchanged
      expect(updatedTask.due_date).toBe(task.due_date); // Unchanged
      expect(updatedTask.completed).toBe(task.completed); // Unchanged
      expect(updatedTask.user_id).toBe(TEST_USER_ID);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await PATCH({
        params: { id: 999999 },
        request: new Request('http://localhost', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Task'
          })
        })
      });
      expect(response.status).toBe(404);
    });
  });
}); 
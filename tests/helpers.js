import { db } from '../functions/api/db.js';

// Test user ID that matches our hardcoded value
export const TEST_USER_ID = 'ABC';

// Helper to clean up the database between tests
export async function cleanDb() {
  await db.prepare('DELETE FROM tasks WHERE user_id = ?').run(TEST_USER_ID);
  await db.prepare('DELETE FROM users WHERE id = ?').run(TEST_USER_ID);
}

// Helper to create a test user
export async function createTestUser() {
  await db.prepare(
    'INSERT OR REPLACE INTO users (id, email, password_hash) VALUES (?, ?, ?)'
  ).run(TEST_USER_ID, 'test@example.com', 'dummy_hash');
}

// Helper to create a test task
export async function createTestTask(data = {}) {
  const task = {
    title: data.title || 'Test Task',
    quadrant: data.quadrant || 'urgent-important',
    due_date: data.due_date || null,
    completed: data.completed ? 1 : 0, // Convert boolean to integer
    user_id: TEST_USER_ID
  };

  const result = await db.prepare(
    'INSERT INTO tasks (title, quadrant, due_date, completed, user_id) VALUES (?, ?, ?, ?, ?) RETURNING *'
  ).get(task.title, task.quadrant, task.due_date, task.completed, task.user_id);

  return result;
} 
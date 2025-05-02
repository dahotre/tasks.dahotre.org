import { db } from '../db.js';

// Hardcoded user ID for now
const HARDCODED_USER_ID = 'ABC';

export async function GET() {
  const tasks = await db.prepare(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC'
  ).all(HARDCODED_USER_ID);
  
  return new Response(JSON.stringify(tasks), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  const { title, quadrant, due_date } = await request.json();
  
  const result = await db.prepare(
    'INSERT INTO tasks (title, quadrant, due_date, user_id) VALUES (?, ?, ?, ?) RETURNING *'
  ).get(title, quadrant, due_date, HARDCODED_USER_ID);
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
    status: 201
  });
} 
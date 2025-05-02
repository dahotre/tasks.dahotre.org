import { db } from '../db.js';

// Hardcoded user ID for now
const HARDCODED_USER_ID = 'ABC';

// Handler for /api/tasks/:id
function getIdFromUrl(url) {
  const match = url.pathname.match(/\/tasks\/(\d+)/);
  return match ? match[1] : null;
}

export async function GET({ params }) {
  const task = await db.prepare(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?'
  ).get(params.id, HARDCODED_USER_ID);
  
  if (!task) {
    return new Response('Task not found', { status: 404 });
  }
  
  return new Response(JSON.stringify(task), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE({ params }) {
  const result = await db.prepare(
    'DELETE FROM tasks WHERE id = ? AND user_id = ? RETURNING *'
  ).get(params.id, HARDCODED_USER_ID);
  
  if (!result) {
    return new Response('Task not found', { status: 404 });
  }
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PUT({ params, request }) {
  const updates = await request.json();
  const { title, quadrant, due_date, completed } = updates;
  
  const result = await db.prepare(
    `UPDATE tasks 
     SET title = ?, quadrant = ?, due_date = ?, completed = ?
     WHERE id = ? AND user_id = ?
     RETURNING *`
  ).get(title, quadrant, due_date, completed ? 1 : 0, params.id, HARDCODED_USER_ID);
  
  if (!result) {
    return new Response('Task not found', { status: 404 });
  }
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PATCH({ params, request }) {
  const updates = await request.json();
  
  // Build the SET clause dynamically based on provided fields
  const updateFields = [];
  const values = [];
  
  if ('title' in updates) {
    updateFields.push('title = ?');
    values.push(updates.title);
  }
  if ('quadrant' in updates) {
    updateFields.push('quadrant = ?');
    values.push(updates.quadrant);
  }
  if ('due_date' in updates) {
    updateFields.push('due_date = ?');
    values.push(updates.due_date);
  }
  if ('completed' in updates) {
    updateFields.push('completed = ?');
    values.push(updates.completed ? 1 : 0);
  }
  
  // Add the WHERE clause parameters
  values.push(params.id, HARDCODED_USER_ID);
  
  const result = await db.prepare(
    `UPDATE tasks 
     SET ${updateFields.join(', ')}
     WHERE id = ? AND user_id = ?
     RETURNING *`
  ).get(...values);
  
  if (!result) {
    return new Response('Task not found', { status: 404 });
  }
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
} 
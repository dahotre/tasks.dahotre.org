import { createJsonResponse, createErrorResponse } from './tasks/utils';

export async function onRequestGet({ env }) {
  console.log('[GET /api/tasks] Fetching all tasks');
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM tasks ORDER BY due_date ASC'
    ).bind().all();
    console.log(`[GET /api/tasks] Fetched ${results.length} tasks`);
    return createJsonResponse(results);
  } catch (err) {
    console.error('[GET /api/tasks] Error:', err);
    return createErrorResponse('Failed to fetch tasks', err.message);
  }
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
    console.log('[POST /api/tasks] Request data:', data);
    const { title, quadrant, due_date } = data;

    if (!title || !quadrant) {
      console.warn('[POST /api/tasks] Missing required fields:', data);
      return createErrorResponse(
        'Missing required fields: title and quadrant are required.',
        null,
        400
      );
    }

    const { results } = await env.DB.prepare(
      'INSERT INTO tasks (title, quadrant, due_date) VALUES (?, ?, ?) RETURNING *'
    ).bind(title, quadrant, due_date).all();
    console.log('[POST /api/tasks] Task created:', results[0]);
    return createJsonResponse(results[0], 201);
  } catch (err) {
    console.error('[POST /api/tasks] Error:', err, 'Request data:', data);
    return createErrorResponse('Failed to create task', err.message);
  }
}
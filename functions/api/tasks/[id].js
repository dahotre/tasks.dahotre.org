import { getIdFromUrl, createJsonResponse, createErrorResponse } from './utils';

// Handler for /api/tasks/:id
export async function onRequestGet({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  console.log(`[GET /api/tasks/${id}] Fetching task`);
  if (!id) {
    console.warn('[GET /api/tasks/:id] Task ID required');
    return createErrorResponse('Task ID required', null, 400);
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM tasks WHERE id = ?'
    ).bind(id).all();

    if (!results || !results.length) {
      console.warn(`[GET /api/tasks/${id}] Task not found`);
      return createErrorResponse('Task not found', null, 404);
    }

    console.log(`[GET /api/tasks/${id}] Task found:`, results[0]);
    return createJsonResponse(results[0]);
  } catch (err) {
    console.error(`[GET /api/tasks/${id}] Error:`, err);
    return createErrorResponse('Failed to fetch task', err.message);
  }
}

export async function onRequestDelete({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  console.log(`[DELETE /api/tasks/${id}] Deleting task`);
  if (!id) {
    console.warn('[DELETE /api/tasks/:id] Task ID required');
    return createErrorResponse('Task ID required', null, 400);
  }

  try {
    const { results } = await env.DB.prepare(
      'DELETE FROM tasks WHERE id = ? RETURNING *'
    ).bind(id).all();

    if (!results || !results.length) {
      console.warn(`[DELETE /api/tasks/${id}] Task not found`);
      return createErrorResponse('Task not found', null, 404);
    }

    console.log(`[DELETE /api/tasks/${id}] Task deleted`);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`[DELETE /api/tasks/${id}] Error:`, err);
    return createErrorResponse('Failed to delete task', err.message);
  }
}

export async function onRequestPut({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  let data;
  console.log(`[PUT /api/tasks/${id}] Updating task`);
  if (!id) {
    console.warn('[PUT /api/tasks/:id] Task ID required');
    return createErrorResponse('Task ID required', null, 400);
  }

  try {
    data = await request.json();
    console.log(`[PUT /api/tasks/${id}] Request data:`, data);
    const { title, quadrant, due_date, completed } = data;

    if (!title || !quadrant) {
      console.warn(`[PUT /api/tasks/${id}] Missing required fields:`, data);
      return createErrorResponse(
        'Missing required fields: title and quadrant are required.',
        null,
        400
      );
    }

    const { results } = await env.DB.prepare(
      'UPDATE tasks SET title = ?, quadrant = ?, due_date = ?, completed = ? WHERE id = ? RETURNING *'
    ).bind(title, quadrant, due_date, completed ? 1 : 0, id).all();

    if (!results || !results.length) {
      console.warn(`[PUT /api/tasks/${id}] Task not found`);
      return createErrorResponse('Task not found', null, 404);
    }

    console.log(`[PUT /api/tasks/${id}] Task updated:`, results[0]);
    return createJsonResponse(results[0]);
  } catch (err) {
    console.error(`[PUT /api/tasks/${id}] Error:`, err, 'Request data:', data);
    return createErrorResponse('Failed to update task', err.message);
  }
}

export async function onRequestPatch({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  let data;
  console.log(`[PATCH /api/tasks/${id}] Partially updating task`);
  if (!id) {
    console.warn('[PATCH /api/tasks/:id] Task ID required');
    return createErrorResponse('Task ID required', null, 400);
  }

  try {
    data = await request.json();
    console.log(`[PATCH /api/tasks/${id}] Request data:`, data);
    const fields = [];
    const values = [];

    for (const key of ['title', 'quadrant', 'due_date', 'completed']) {
      if (key in data) {
        fields.push(`${key} = ?`);
        values.push(key === 'completed' ? (data[key] ? 1 : 0) : data[key]);
      }
    }

    if (fields.length === 0) {
      console.warn(`[PATCH /api/tasks/${id}] No fields to update`);
      return createErrorResponse('No fields to update', null, 400);
    }

    values.push(id); // Add id for WHERE clause
    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? RETURNING *`;
    const { results } = await env.DB.prepare(sql).bind(...values).all();

    if (!results || !results.length) {
      console.warn(`[PATCH /api/tasks/${id}] Task not found`);
      return createErrorResponse('Task not found', null, 404);
    }

    console.log(`[PATCH /api/tasks/${id}] Task updated:`, results[0]);
    return createJsonResponse(results[0]);
  } catch (err) {
    console.error(`[PATCH /api/tasks/${id}] Error:`, err, 'Request data:', data);
    return createErrorResponse('Failed to update task', err.message);
  }
} 
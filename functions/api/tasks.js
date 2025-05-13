import { createJsonResponse, createErrorResponse, getTokenFromCookie, verifyUserFromRequest } from './tasks/utils';
import { verify } from '@tsndr/cloudflare-worker-jwt';

export async function onRequestGet({ request, env }) {
  // Authenticate user
  const result = await verifyUserFromRequest(request, env);
  if (!result) {
    return createErrorResponse('Not authenticated', null, 401);
  }
  const user = result.payload;
  console.log(`[GET /api/tasks] Fetching tasks for user: ${JSON.stringify(user)}`);
  console.log(`[GET /api/tasks] Fetching tasks for user_id: ${user.id}`);
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC'
    ).bind(user.id).all();
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

    // Extract user_id from JWT in cookie using shared logic
    const result = await verifyUserFromRequest(request, env);
    if (!result) {
      return createErrorResponse('Not authenticated', 'Invalid token', 401);
    }
    const user_id = result.payload.id;

    // Debug log for DB insert values
    console.log('[POST /api/tasks] About to insert with:', {
      title, quadrant, due_date, user_id,
      types: {
        title: typeof title,
        quadrant: typeof quadrant,
        due_date: typeof due_date,
        user_id: typeof user_id,
      }
    });
    
    // Handle undefined due_date by using null (D1 doesn't support undefined values)
    const due_date_value = due_date === undefined ? null : due_date;
    
    const sql = 'INSERT INTO tasks (title, quadrant, due_date, user_id) VALUES (?, ?, ?, ?) RETURNING *';
    console.log('[POST /api/tasks] SQL:', sql);

    const { results } = await env.DB.prepare(sql)
      .bind(title, quadrant, due_date_value, user_id).all();
    console.log('[POST /api/tasks] Task created:', results[0]);
    return createJsonResponse(results[0], 201);
  } catch (err) {
    console.error('[POST /api/tasks] Error:', err, 'Request data:', data);
    return createErrorResponse('Failed to create task', err.message);
  }
}
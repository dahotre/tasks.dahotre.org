export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare("SELECT * FROM tasks ORDER BY due_date ASC").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch tasks", details: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { title, due_date, quadrant } = data;
    if (!title || !quadrant) {
      return new Response(JSON.stringify({ error: "Missing required fields: title and quadrant are required." }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }
    await env.DB.prepare(
      "INSERT INTO tasks (title, due_date, quadrant) VALUES (?, ?, ?)"
    ).bind(title, due_date, quadrant).run();
    return new Response(JSON.stringify({ message: "Task created" }), {
      headers: { "Content-Type": "application/json" },
      status: 201
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create task", details: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}

function getIdFromUrl(url) {
  const match = url.pathname.match(/\/tasks\/(\d+)/);
  return match ? match[1] : null;
}

export async function onRequestDelete({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const result = await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to delete task', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPut({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const data = await request.json();
    const { title, due_date, quadrant, completed } = data;
    if (!title || !quadrant) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title and quadrant are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const result = await env.DB.prepare('UPDATE tasks SET title = ?, due_date = ?, quadrant = ?, completed = ? WHERE id = ?')
      .bind(title, due_date, quadrant, completed ? 1 : 0, id).run();
    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ message: 'Task updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update task', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPatch({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const data = await request.json();
    const fields = [];
    const values = [];
    for (const key of ['title', 'due_date', 'quadrant', 'completed']) {
      if (key in data) {
        fields.push(`${key} = ?`);
        if (key === 'completed') {
          values.push(data[key] ? 1 : 0);
        } else {
          values.push(data[key]);
        }
      }
    }
    if (fields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    const result = await env.DB.prepare(sql).bind(...values, id).run();
    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ message: 'Task updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update task', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestGetId({ request, env }) {
  const id = getIdFromUrl(new URL(request.url));
  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const { results } = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).all();
    if (!results.length) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(results[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch task', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 
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
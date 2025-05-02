export function getIdFromUrl(url) {
  const match = url.pathname.match(/\/tasks\/(\d+)/);
  return match ? match[1] : null;
}

export function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status
  });
}

export function createErrorResponse(message, details = null, status = 500) {
  const error = { error: message };
  if (details) error.details = details;
  return createJsonResponse(error, status);
} 
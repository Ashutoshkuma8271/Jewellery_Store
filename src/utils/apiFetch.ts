export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const isRelative = endpoint.startsWith('/');
  const primaryUrl = endpoint;
  const fallbackUrl = isRelative ? `http://127.0.0.1:4001${endpoint}` : endpoint;

  // Auto-attach stored Authorization token if present and not provided
  const headers = new Headers(options.headers || {});
  if (!headers.has('Authorization')) {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('luxe_auth_token') || sessionStorage.getItem('luxe_auth_token')
        : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const reqOptions: RequestInit = {
    ...options,
    headers
  };

  try {
    const res = await fetch(primaryUrl, reqOptions);
    // If response is good or client error (4xx), return it directly
    if (res.status !== 502 && res.status !== 503 && res.status !== 504) {
      return res;
    }
    // If 502/503/504 proxy error, try direct fallback
    return await fetch(fallbackUrl, reqOptions);
  } catch (err) {
    // If network error (ECONNREFUSED, CORS, etc.), try direct fallback URL
    if (isRelative && primaryUrl !== fallbackUrl) {
      try {
        return await fetch(fallbackUrl, reqOptions);
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

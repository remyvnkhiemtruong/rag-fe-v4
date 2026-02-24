// src/services/api.helpers.js (optional split)
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function parseJsonResponse(res) {
  const text = await res.text();
  const trimmed = text.trim();
  if (trimmed.startsWith('<')) {
    const url = typeof API_BASE_URL === 'string' ? API_BASE_URL : '(check VITE_BACKEND_URL)';
    throw new Error(`Backend returned HTML instead of JSON. Is the API server running? Expected: ${url}`);
  }
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new Error('Invalid JSON from API.');
  }
}

export function createPublicInfoApi(segment) {
  return {
    /**
     * Public: Get list
     * GET /api/{segment}?page=&limit=
     * Returns: { data, pagination }
     */
    async getAll(page = 1, limit = 20) {
      const res = await fetch(
        `${API_BASE_URL}/${segment}?page=${page}&limit=${limit}`
      );
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(`Failed to fetch ${segment}`);
      return result;
    },

    /**
     * Public: Get by ID
     * GET /api/{segment}/:id
     */
    async getById(id) {
      const res = await fetch(`${API_BASE_URL}/${segment}/${id}`);
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(`${segment} not found`);
      return result;
    },
  };
}

export function createAdminInfoApi(segment) {
  return {
    async getAll(page = 1, limit = 20) {
      const res = await fetch(
        `${API_BASE_URL}/admin/${segment}?page=${page}&limit=${limit}`
      );
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(`Failed to fetch ${segment}`);
      return result;
    },

    async getById(id) {
      const res = await fetch(`${API_BASE_URL}/admin/${segment}/${id}`);
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(`${segment} not found`);
      return result;
    },

    async create(body) {
      const res = await fetch(`${API_BASE_URL}/admin/${segment}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(result?.error || `Failed to create ${segment}`);
      return result;
    },

    async update(id, body) {
      const res = await fetch(`${API_BASE_URL}/admin/${segment}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(result?.error || `Failed to update ${segment}`);
      return result;
    },

    async delete(id) {
      const res = await fetch(`${API_BASE_URL}/admin/${segment}/${id}`, {
        method: 'DELETE',
      });
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error(result?.error || `Failed to delete ${segment}`);
      return result;
    },
  };
}



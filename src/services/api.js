// src/services/api.js
/**
 * API contract (FE <-> BE)
 * Base URL: VITE_BACKEND_URL (e.g. http://localhost:5000/api)
 *
 * Endpoints used by FE:
 * - GET  /heritages?lang=&page=&limit=  -> { data, pagination }
 * - GET  /heritages/:id?lang=           -> heritage object
 * - GET  /admin/heritages?page=&limit= -> { success, data, pagination }
 * - GET  /admin/heritages/:id           -> { success, data }
 * - POST /admin/heritages               -> FormData -> { success, data, message }
 * - PUT  /admin/heritages/:id           -> FormData -> { success, data, message }
 * - DELETE /admin/heritages/:id         -> { success, message }
 * - GET  /languages                    -> languages array
 * - GET  /constants/ranking-types      -> { success, data: string[] } (codes or labels)
 * - GET  /map-places                    -> places array
 * - GET  /admin/map-places              -> { data }
 * - POST /admin/map-places              -> FormData
 * - PUT  /admin/map-places/:id          -> FormData
 * - DELETE /admin/map-places/:id
 * - GET  /music, /admin/music, POST/DELETE /admin/music, etc.
 * - GET  /fineart, /admin/fineart, POST/DELETE /admin/fineart, etc.
 */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { createAdminInfoApi, createPublicInfoApi } from "./api.helpers";

/** Parse response as JSON; if server returned HTML (e.g. SPA fallback), throw clear error. */
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

const heritageApi = {
  // ========================================
  // PUBLIC ROUTES (with language support)
  // ========================================

  /**
   * Get paginated heritage list by language
   * Returns: { data: [...], pagination: { page, limit, total, totalPages } }
   */
  async getAll(lang = 'vi', page = 1, limit = 10) {
    const res = await fetch(`${API_BASE_URL}/heritages?lang=${lang}&page=${page}&limit=${limit}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error(result?.message || 'Failed to fetch heritages');

    // Backend returns { data, pagination } directly
    return result;
  },

  /**
   * Get heritage detail by ID and language
   * Returns: heritage object with translations, gallery, youtube_links, available_languages
   */
  async getById(id, lang = 'vi') {
    const res = await fetch(`${API_BASE_URL}/heritages/${id}?lang=${lang}`);
    const heritage = await parseJsonResponse(res);
    if (!res.ok) throw new Error(heritage?.message || 'Heritage not found');

    // Backend returns heritage object directly (not wrapped)
    return heritage;
  },

  // ========================================
  // ADMIN ROUTES
  // ========================================

  /**
   * Admin: Get all heritages (Vietnamese only, for management)
   * Returns: { success: true, data: [...], pagination: {...} }
   */
  async adminGetAll(page = 1, limit = 10) {
    const res = await fetch(`${API_BASE_URL}/admin/heritages?page=${page}&limit=${limit}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error(result?.message || 'Failed to fetch heritages');

    // Backend returns { success: true, data, pagination }
    return result;
  },

  /**
   * Admin: Get heritage detail by ID
   * Returns: { success: true, data: {...} }
   */
  async adminGetById(id) {
    const res = await fetch(`${API_BASE_URL}/admin/heritages/${id}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error(result?.message || 'Heritage not found');

    // Backend returns { success: true, data: {...} }
    return result;
  },

  /**
   * Admin: Create new heritage
   * FormData fields:
   * - name, information, year_built, year_ranked, ranking_type
   * - address, commune, district, province, notes
   * - input_lang (default: 'vi')
   * - image (file - main cover)
   * - audio (file - optional, for original language)
   * - gallery (files[] - up to 20 images)
   * - youtube_links (JSON string array)
   * 
   * Returns: { success: true, data: { id }, message }
   */
  async create(formData) {
    const res = await fetch(`${API_BASE_URL}/admin/heritages`, {
      method: 'POST',
      body: formData, // FormData object
    });

    const result = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(result.error || result.message || 'Failed to create heritage');
    }

    // Backend returns { success: true, data: { id }, message }
    return result;
  },

  /**
   * Admin: Update existing heritage
   * FormData fields: same as create, plus:
   * - regenerate_translations (boolean/string - force regenerate all translations)
   * - keep_media_ids (JSON string array - media IDs to keep, others deleted)
   * 
   * Returns: { success: true, data: { id }, message }
   */
  async update(id, formData) {
    const res = await fetch(`${API_BASE_URL}/admin/heritages/${id}`, {
      method: 'PUT',
      body: formData,
    });

    const result = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(result.error || result.message || 'Failed to update heritage');
    }

    // Backend returns { success: true, data: { id }, message }
    return result;
  },

  /**
   * Admin: Delete heritage
   * Cascades to translations, media (files also deleted from disk)
   * Returns: { success: true, message }
   */
  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/admin/heritages/${id}`, {
      method: 'DELETE',
    });

    const result = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(result.error || result.message || 'Failed to delete heritage');
    }

    // Backend returns { success: true, message }
    return result;
  },

  // ========================================
  // UTILITY
  // ========================================

  /**
   * Get supported languages
   * Returns: { success: true, data: [{ code, name, ttsCode? }, ...] }
   * Supported languages: vi, en, km, zh
   */
  async getLanguages() {
    try {
      const res = await fetch(`${API_BASE_URL}/languages`);
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error('Endpoint not found');
      // Normalize: backend may return array or { success, data }
      const data = Array.isArray(json) ? json : (json.data || []);
      return { success: true, data };
    } catch {
      // Fallback if endpoint doesn't exist
      return {
        success: true,
        data: [
          { code: 'vi', name: 'Tiếng Việt', ttsCode: 'vi-VN' },
          { code: 'en', name: 'English', ttsCode: 'en-US' },
          { code: 'km', name: 'ភាសាខ្មែរ', ttsCode: 'km-KH' },
          { code: 'zh', name: '中文', ttsCode: 'zh-CN' }
        ]
      };
    }
  },
};

const musicApi = {
  // ========================================
  // PUBLIC ROUTES
  // ========================================

  /**
   * Public: Get paginated music list
   * GET /api/music?page=1&limit=10
   * Returns: { data: [...], pagination: {...} }
   */
  async getAll(page = 1, limit = 10) {
    const res = await fetch(
      `${API_BASE_URL}/music?page=${page}&limit=${limit}`
    );

    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Failed to fetch music');
    return result;
  },

  /**
   * Public: Get music by ID
   * GET /api/music/:id
   */
  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/music/${id}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Music not found');
    return result;
  },

  // ========================================
  // ADMIN ROUTES
  // ========================================

  /**
   * Admin: Get all music
   * GET /api/admin/music
   */
  async adminGetAll(page = 1, limit = 10) {
    const res = await fetch(
      `${API_BASE_URL}/admin/music?page=${page}&limit=${limit}`
    );
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Failed to fetch music');
    return result;
  },

  /**
   * Admin: Get music by ID
   * GET /api/admin/music/:id
   */
  async adminGetById(id) {
    const res = await fetch(`${API_BASE_URL}/admin/music/${id}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Music not found');
    return result;
  },

  /**
   * Admin: Create music (multiple links)
   * POST /api/admin/music
   * Body: { links: string[] }
   */
  async create(links) {
    const res = await fetch(`${API_BASE_URL}/admin/music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ links }),
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result?.error || 'Failed to create music');
    }
    return result;
  },

  /**
   * Admin: Delete music
   * DELETE /admin/music/:id
   */
  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/admin/music/${id}`, {
      method: 'DELETE',
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result?.error || 'Failed to delete music');
    }
    return result;
  },
};

const fineArtApi = {
  // ========================================
  // PUBLIC ROUTES
  // ========================================

  /**
   * Public: Get paginated fineart list
   * GET /api/fineart?page=1&limit=10
   * Returns: { data: [...], pagination: {...} }
   */
  async getAll(page = 1, limit = 10) {
    const res = await fetch(
      `${API_BASE_URL}/fineart?page=${page}&limit=${limit}`
    );
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Failed to fetch fineart');
    return result;
  },

  /**
   * Public: Get fineart by ID
   * GET /api/fineart/:id
   */
  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/fineart/${id}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Fineart not found');
    return result;
  },

  // ========================================
  // ADMIN ROUTES
  // ========================================

  /**
   * Admin: Get all fineart
   * GET /api/admin/fineart?page=1&limit=10
   */
  async adminGetAll(page = 1, limit = 10) {
    const res = await fetch(
      `${API_BASE_URL}/admin/fineart?page=${page}&limit=${limit}`
    );
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Failed to fetch fineart');
    return result;
  },

  /**
   * Admin: Get fineart by ID
   * GET /api/admin/fineart/:id
   */
  async adminGetById(id) {
    const res = await fetch(`${API_BASE_URL}/admin/fineart/${id}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Fineart not found');
    return result;
  },

  /**
   * Admin: Create fineart (upload multiple images)
   * POST /api/admin/fineart
   * Body: FormData
   * - fineart (files[])
   */
  async create(formData) {
    const res = await fetch(`${API_BASE_URL}/admin/fineart`, {
      method: 'POST',
      body: formData,
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result?.error || 'Failed to upload fineart');
    }
    return result;
  },

  /**
   * Admin: Delete fineart
   * DELETE /api/admin/fineart/:id
   */
  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/admin/fineart/${id}`, {
      method: 'DELETE',
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) {
      throw new Error(result?.error || 'Failed to delete fineart');
    }
    return result;
  },
};

const mapPlacesApi = {
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/map-places`);
    const json = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Failed to fetch map places');
    return json?.data || [];
  },

  async adminGetAll() {
    const res = await fetch(`${API_BASE_URL}/admin/map-places`);
    const json = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Failed to fetch map places');
    return json;
  },

  async adminGetById(id) {
    const res = await fetch(`${API_BASE_URL}/admin/map-places/${id}`);
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error('Map place not found');
    return result;
  },

  async create(formData) {
    const res = await fetch(`${API_BASE_URL}/admin/map-places`, {
      method: 'POST',
      body: formData,
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error(result?.error || 'Failed to create map place');
    return result;
  },

  async update(id, formData) {
    const res = await fetch(`${API_BASE_URL}/admin/map-places/${id}`, {
      method: 'PUT',
      body: formData,
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error(result?.error || 'Failed to update map place');
    return result;
  },

  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/admin/map-places/${id}`, {
      method: 'DELETE',
    });
    const result = await parseJsonResponse(res);
    if (!res.ok) throw new Error(result?.error || 'Failed to delete map place');
    return result;
  },
};

const constantsApi = {
  /**
   * Get ranking types from backend (single source of truth)
   * Returns: { success: true, data: string[] }
   */
  async getRankingTypes() {
    try {
      const res = await fetch(`${API_BASE_URL}/constants/ranking-types`);
      const result = await parseJsonResponse(res);
      if (!res.ok) throw new Error('Failed to fetch ranking types');
      return result;
    } catch {
      return {
        success: true,
        data: ['Quốc gia đặc biệt', 'Quốc gia', 'Cấp tỉnh']
      };
    }
  },
};


// ===== PUBLIC APIs (used by galleries, users, visitors)
const economicsApi = createPublicInfoApi('economics');
const geographyApi = createPublicInfoApi('geography');
const literatureApi = createPublicInfoApi('literature');

// ===== ADMIN APIs (used by CMS, dashboard)
const adminEconomicsApi = createAdminInfoApi('economics');
const adminGeographyApi = createAdminInfoApi('geography');
const adminLiteratureApi = createAdminInfoApi('literature');

export {
  heritageApi,
  musicApi,
  fineArtApi,
  constantsApi,
  mapPlacesApi,

  // Public
  economicsApi,
  geographyApi,
  literatureApi,

  // Admin
  adminEconomicsApi,
  adminGeographyApi,
  adminLiteratureApi,
};
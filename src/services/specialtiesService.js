const backendApi = process.env.BACKEND_API;

// In-memory cache for specialties (1 hour)
const specialtiesCache = { data: null, expiry: 0 };
const SPECIALTIES_TTL_MS = 60 * 60 * 1000;

export const specialtiesService = {
  // Fetch all specialties with in-memory caching
  async getSpecialties() {
    if (specialtiesCache.data && Date.now() < specialtiesCache.expiry) {
      return specialtiesCache.data;
    }

    if (!backendApi) return [];

    try {
      const res = await fetch(`${backendApi}/specialties`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      const result = json?.data || [];
      specialtiesCache.data = result;
      specialtiesCache.expiry = Date.now() + SPECIALTIES_TTL_MS;
      return result;
    } catch {
      return [];
    }
  },

  // Fetch single specialty by ID
  async getSpecialtyById(specialtyId) {
    if (!backendApi || !specialtyId) return null;

    try {
      const res = await fetch(`${backendApi}/specialties/${encodeURIComponent(specialtyId)}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch {
      return null;
    }
  },

  // Create new specialty (admin)
  async createSpecialty(payload) {
    try {
      const res = await fetch("/api/specialties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      // Invalidate cache
      specialtiesCache.data = null;
      return { success: res.ok, data: data?.data || data };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Update specialty (admin)
  async updateSpecialty(specialtyId, payload) {
    if (!specialtyId) return { success: false };

    try {
      const res = await fetch(`/api/specialties/${encodeURIComponent(specialtyId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      // Invalidate cache
      specialtiesCache.data = null;
      return { success: res.ok, data: data?.data || data };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Delete specialty (admin)
  async deleteSpecialty(specialtyId) {
    if (!specialtyId) return { success: false };

    try {
      const res = await fetch(`/api/specialties/${encodeURIComponent(specialtyId)}`, {
        method: "DELETE",
      });
      // Invalidate cache
      specialtiesCache.data = null;
      return { success: res.ok };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },
};

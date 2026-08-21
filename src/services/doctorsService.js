const backendApi = process.env.BACKEND_API;

// In-memory cache with TTL (10 minutes)
const memoryCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCached(key) {
  const item = memoryCache.get(key);
  if (item && Date.now() < item.expiry) {
    return item.data;
  }
  return null;
}

function setCached(key, data) {
  memoryCache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

export const doctorsService = {
  // Fetch active doctors list
  async getDoctors(options = 100) {
    if (!backendApi) return [];

    const rawLimit = typeof options === "number" ? options : options.limit || 100;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const specialtyId = typeof options === "object" ? options.specialtyId : undefined;

    const cacheKey = `doctors_${limit}_${specialtyId || "all"}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    let url = `${backendApi}/doctors?limit=${limit}`;
    if (specialtyId) {
      url += `&specialty_id=${encodeURIComponent(specialtyId)}`;
    }

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      const result = json?.data || [];
      setCached(cacheKey, result);
      return result;
    } catch {
      return [];
    }
  },

  // Fetch paginated doctors list with limit, offset, and specialty filter
  async getDoctorsPaginated({ limit = 12, offset = 0, specialtyId } = {}) {
    if (!backendApi) return { data: [], total: 0, limit: 12, offset: 0 };

    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const cacheKey = `doctors_paginated_${safeLimit}_${safeOffset}_${specialtyId || "all"}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    let url = `${backendApi}/doctors?limit=${safeLimit}&offset=${safeOffset}`;
    if (specialtyId && specialtyId !== "all") {
      url += `&specialty_id=${encodeURIComponent(specialtyId)}`;
    }

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return { data: [], total: 0, limit: safeLimit, offset: safeOffset };
      const json = await res.json();
      const result = {
        data: json?.data || [],
        total: typeof json?.total === "number" ? json.total : (json?.data?.length || 0),
        limit: safeLimit,
        offset: safeOffset,
      };
      setCached(cacheKey, result);
      return result;
    } catch {
      return { data: [], total: 0, limit: safeLimit, offset: safeOffset };
    }
  },

  // Fetch single doctor details by ID
  async getDoctorById(doctorId) {
    if (!backendApi || !doctorId) return null;

    const cacheKey = `doctor_${doctorId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${backendApi}/doctors/${encodeURIComponent(doctorId)}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const result = json?.data || json || null;
      if (result) setCached(cacheKey, result);
      return result;
    } catch {
      return null;
    }
  },

  // Fetch doctor weekly schedule
  async getDoctorSchedule(doctorId) {
    if (!backendApi || !doctorId) return [];

    const cacheKey = `schedule_${doctorId}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${backendApi}/doctors/${encodeURIComponent(doctorId)}/schedule`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      const result = json?.data || [];
      setCached(cacheKey, result);
      return result;
    } catch {
      return [];
    }
  },

  // Fetch doctor availability for specific date and period
  async getDoctorAvailability(doctorId, date, period) {
    if (!backendApi || !doctorId || !date || !period) return null;

    try {
      const res = await fetch(
        `${backendApi}/doctors/${encodeURIComponent(doctorId)}/availability?date=${encodeURIComponent(date)}&period=${encodeURIComponent(period)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch {
      return null;
    }
  },

  // Fetch slim doctor list for booking wizard
  async getDoctorsNames(limit = 100) {
    if (!backendApi) return [];

    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 100);
    const cacheKey = `doctors_names_${safeLimit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${backendApi}/doctors?limit=${safeLimit}&include_images=false`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      const doctors = json?.data || [];
      const result = doctors.map(({ doctor_id, full_name_ar, specialty_id }) => ({
        doctor_id,
        full_name_ar,
        specialty_id,
      }));
      setCached(cacheKey, result);
      return result;
    } catch {
      return [];
    }
  },

  // Create new doctor (admin)
  async createDoctor(payload) {
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      memoryCache.clear();
      return { success: res.ok, data: data?.data || data, message: data?.message };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Update doctor (admin)
  async updateDoctor(doctorId, payload) {
    if (!doctorId) return { success: false };

    try {
      const res = await fetch(`/api/doctors/${encodeURIComponent(doctorId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      memoryCache.clear();
      return { success: res.ok, data: data?.data || data, message: data?.message };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Delete doctor (admin)
  async deleteDoctor(doctorId) {
    if (!doctorId) return { success: false };

    try {
      const res = await fetch(`/api/doctors/${encodeURIComponent(doctorId)}`, {
        method: "DELETE",
      });
      memoryCache.clear();
      return { success: res.ok };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Update doctor schedule (admin)
  async updateDoctorSchedule(doctorId, schedulePayload) {
    if (!doctorId) return { success: false };

    try {
      const res = await fetch(`/api/doctors/${encodeURIComponent(doctorId)}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedulePayload),
      });
      const data = await res.json().catch(() => ({}));
      memoryCache.clear();
      return { success: res.ok, data: data?.data || data, message: data?.message };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },
};

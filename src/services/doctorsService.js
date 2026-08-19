const getBackendApi = () => {
  return (process.env.BACKEND_API || "").replace(/\/$/, "");
};

// Default cache revalidation time in seconds (1 hour)
const CACHE_REVALIDATE_SECONDS = 3600;

export const doctorsService = {
  // Fetch active doctors list with Next.js data caching
  async getDoctors(options = 100) {
    const backendApi = getBackendApi();
    if (!backendApi) return [];

    const rawLimit = typeof options === "number" ? options : options.limit || 100;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const specialtyId = typeof options === "object" ? options.specialtyId : undefined;

    let url = `${backendApi}/doctors?limit=${limit}`;
    if (specialtyId) {
      url += `&specialty_id=${encodeURIComponent(specialtyId)}`;
    }

    try {
      const res = await fetch(url, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["doctors"] },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json?.data || [];
    } catch {
      return [];
    }
  },

  // Fetch paginated doctors list with limit, offset, and specialty filter
  async getDoctorsPaginated({ limit = 12, offset = 0, specialtyId } = {}) {
    const backendApi = getBackendApi();
    if (!backendApi) return { data: [], total: 0, limit: 12, offset: 0 };

    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    let url = `${backendApi}/doctors?limit=${safeLimit}&offset=${safeOffset}`;
    if (specialtyId && specialtyId !== "all") {
      url += `&specialty_id=${encodeURIComponent(specialtyId)}`;
    }

    try {
      const res = await fetch(url, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["doctors"] },
      });
      if (!res.ok) return { data: [], total: 0, limit: safeLimit, offset: safeOffset };
      const json = await res.json();
      return {
        data: json?.data || [],
        total: typeof json?.total === "number" ? json.total : (json?.data?.length || 0),
        limit: safeLimit,
        offset: safeOffset,
      };
    } catch {
      return { data: [], total: 0, limit: safeLimit, offset: safeOffset };
    }
  },

  // Fetch single doctor details by ID
  async getDoctorById(doctorId) {
    const backendApi = getBackendApi();
    if (!backendApi || !doctorId) return null;

    try {
      const res = await fetch(`${backendApi}/doctors/${encodeURIComponent(doctorId)}`, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: [`doctor-${doctorId}`] },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json || null;
    } catch {
      return null;
    }
  },

  // Fetch doctor weekly schedule
  async getDoctorSchedule(doctorId) {
    const backendApi = getBackendApi();
    if (!backendApi || !doctorId) return [];

    try {
      const res = await fetch(`${backendApi}/doctors/${encodeURIComponent(doctorId)}/schedule`, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: [`schedule-${doctorId}`] },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json?.data || [];
    } catch {
      return [];
    }
  },

  // Fetch doctor availability for specific date and period
  async getDoctorAvailability(doctorId, date, period) {
    const backendApi = getBackendApi();
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
};

import { doctorsService } from "./doctorsService";

const getBackendApi = () => {
  return (process.env.BACKEND_API || "").replace(/\/$/, "");
};

// In-memory cache for specialties (1 hour)
const specialtiesCache = { data: null, expiry: 0 };
const SPECIALTIES_TTL_MS = 60 * 60 * 1000;

export const bookingService = {
  // Fetch active medical specialties with in-memory caching
  async getSpecialties() {
    if (specialtiesCache.data && Date.now() < specialtiesCache.expiry) {
      return specialtiesCache.data;
    }

    const backendApi = getBackendApi();
    if (!backendApi) return [];

    try {
      const res = await fetch(`${backendApi}/specialties?limit=100`, {
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

  // Create new patient appointment
  async createAppointment(payload) {
    const backendApi = getBackendApi();
    if (!backendApi) return null;

    try {
      const res = await fetch(`${backendApi}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch {
      return null;
    }
  },

  // Delegated doctor methods for backward compatibility
  getDoctors: doctorsService.getDoctors,
  getDoctorsNames: doctorsService.getDoctorsNames,
  getDoctorsPaginated: doctorsService.getDoctorsPaginated,
  getDoctorById: doctorsService.getDoctorById,
  getDoctorSchedule: doctorsService.getDoctorSchedule,
  getDoctorAvailability: doctorsService.getDoctorAvailability,
};

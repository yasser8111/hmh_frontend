import { doctorsService } from "./doctorsService";

const getBackendApi = () => {
  return (process.env.BACKEND_API || "").replace(/\/$/, "");
};

// Default cache revalidation time in seconds (1 hour)
const CACHE_REVALIDATE_SECONDS = 3600;

export const bookingService = {
  // Fetch active medical specialties with Next.js data caching
  async getSpecialties() {
    const backendApi = getBackendApi();
    if (!backendApi) return [];

    try {
      const res = await fetch(`${backendApi}/specialties?limit=100`, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["specialties"] },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json?.data || [];
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

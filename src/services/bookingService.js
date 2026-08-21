import { doctorsService } from "./doctorsService";
import { specialtiesService } from "./specialtiesService";

const backendApi = process.env.BACKEND_API;

export const bookingService = {
  // Fetch active medical specialties
  getSpecialties: specialtiesService.getSpecialties,

  // Create new patient appointment (online)
  async createAppointment(payload) {
    if (!payload) return null;

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json || null;
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

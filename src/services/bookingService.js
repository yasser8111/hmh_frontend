import { doctorsService } from "./doctorsService";
import { specialtiesService } from "./specialtiesService";

const backendApi = process.env.BACKEND_API;

export const bookingService = {
  // Fetch active medical specialties
  getSpecialties: specialtiesService.getSpecialties,

  // Create new patient appointment (online)
  async createAppointment(payload) {
    if (!payload) throw new Error("بيانات الحجز غير متوفرة");

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        json?.detail?.message ||
        (Array.isArray(json?.detail) ? json.detail[0]?.msg : json?.detail) ||
        json?.message ||
        "تعذر إتمام الحجز. يرجى التحقق من توفر الطبيب في هذا اليوم.";
      throw new Error(errorMsg);
    }

    return json?.data || json;
  },

  // Delegated doctor methods for backward compatibility
  getDoctors: doctorsService.getDoctors,
  getDoctorsNames: doctorsService.getDoctorsNames,
  getDoctorsPaginated: doctorsService.getDoctorsPaginated,
  getDoctorById: doctorsService.getDoctorById,
  getDoctorSchedule: doctorsService.getDoctorSchedule,
  getDoctorAvailability: doctorsService.getDoctorAvailability,
};

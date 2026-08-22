import { doctorsService } from "./doctorsService";

const backendApi = process.env.BACKEND_API;

export const appointmentsService = {
  // Fetch patient appointments list (enriched with Arabic doctor and specialty names)
  async getAppointments() {
    let token = "";
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("token")?.value || "";
      } catch {
        // Server component header context unavailable
      }
    }

    let appointments = [];

    // If on client side, call our internal Next.js API route
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/appointments", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          appointments = Array.isArray(json?.data) ? json.data : [];
        }
      } catch {
        appointments = [];
      }
    } else if (backendApi) {
      try {
        const res = await fetch(`${backendApi}/appointments`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          appointments = Array.isArray(json?.data) ? json.data : [];
        }
      } catch {
        appointments = [];
      }
    }

    // Enrich with Arabic doctor names and specialties
    if (appointments.length > 0) {
      try {
        const doctors = await doctorsService.getDoctors(100);
        if (Array.isArray(doctors) && doctors.length > 0) {
          const doctorMap = new Map(doctors.map((d) => [d.doctor_id, d]));
          return appointments.map((appt) => {
            const doc = doctorMap.get(appt.doctor_id);
            return {
              ...appt,
              doctor_name_ar: doc?.full_name_ar || null,
              doctor_name_en: doc?.full_name_en || appt.doctor_name || null,
              doctor_name: doc?.full_name_ar || doc?.full_name_en || appt.doctor_name,
              doctor_specialty_ar: doc?.specialty_name_ar || null,
              doctor_specialty_en: doc?.specialty_name_en || appt.doctor_specialty || null,
              doctor_specialty: doc?.specialty_name_ar || doc?.specialty_name_en || appt.doctor_specialty,
              building: doc?.building || appt.building,
            };
          });
        }
      } catch {
        // Fallback to original
      }
    }

    return appointments;
  },

  // Fetch single appointment details by ID (enriched with Arabic doctor and specialty names)
  async getAppointmentById(appointmentId) {
    if (!appointmentId) return null;

    let token = "";
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("token")?.value || "";
      } catch {
        // Server component header context unavailable
      }
    }

    let appt = null;

    // If on client side, call our internal Next.js API route
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          appt = json?.data || json || null;
        }
      } catch {
        appt = null;
      }
    } else if (backendApi) {
      try {
        const res = await fetch(
          `${backendApi}/appointments/${encodeURIComponent(appointmentId)}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          }
        );
        if (res.ok) {
          const json = await res.json();
          appt = json?.data || json || null;
        }
      } catch {
        appt = null;
      }
    }

    // Enrich single appointment with Arabic doctor and specialty names
    if (appt && appt.doctor_id) {
      try {
        const doc = await doctorsService.getDoctorById(appt.doctor_id);
        if (doc) {
          appt = {
            ...appt,
            doctor_name_ar: doc.full_name_ar || null,
            doctor_name_en: doc.full_name_en || appt.doctor_name || null,
            doctor_name: doc.full_name_ar || doc.full_name_en || appt.doctor_name,
            doctor_specialty_ar: doc.specialty_name_ar || null,
            doctor_specialty_en: doc.specialty_name_en || appt.doctor_specialty || null,
            doctor_specialty: doc.specialty_name_ar || doc.specialty_name_en || appt.doctor_specialty,
            building: doc.building || appt.building,
          };
        }
      } catch {
        // Fallback
      }
    }

    return appt;
  },

  // Cancel existing appointment
  async cancelAppointment(appointmentId) {
    if (!appointmentId) return { success: false, message: "رقم الموعد غير صحيح" };

    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json().catch(() => ({}));
      return {
        success: res.ok,
        message: data?.message || (res.ok ? "تم إلغاء الموعد بنجاح" : "فشل إلغاء الموعد"),
      };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Reschedule existing appointment
  async rescheduleAppointment(appointmentId, { date, period }) {
    if (!appointmentId || !date || !period) {
      return { success: false, message: "يرجى تحديد التاريخ والفترة" };
    }

    try {
      const res = await fetch(
        `/api/appointments/${encodeURIComponent(appointmentId)}/reschedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, period }),
        }
      );
      const data = await res.json().catch(() => ({}));
      return {
        success: res.ok,
        message: data?.message || (res.ok ? "تمت إعادة جدولة الموعد بنجاح" : "فشل إعادة الجدولة"),
      };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },
};

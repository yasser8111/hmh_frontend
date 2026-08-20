import { cookies } from "next/headers";

const getBackendApi = () => {
  return (process.env.BACKEND_API || "").replace(/\/$/, "");
};

export const appointmentsService = {
  // Fetch patient appointments list
  async getAppointments() {
    const backendApi = getBackendApi();
    if (!backendApi) return [];

    let token = "";
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    } catch {
      // Running in browser client environment
    }

    try {
      const res = await fetch(`${backendApi}/appointments`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data : [];
    } catch {
      return [];
    }
  },

  // Fetch single appointment details by ID
  async getAppointmentById(appointmentId) {
    const backendApi = getBackendApi();
    if (!backendApi || !appointmentId) return null;

    let token = "";
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    } catch {
      // Running in browser client environment
    }

    try {
      const res = await fetch(`${backendApi}/appointments/${encodeURIComponent(appointmentId)}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json || null;
    } catch {
      return null;
    }
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
      const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, period }),
      });
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

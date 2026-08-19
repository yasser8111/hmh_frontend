const getBackendApi = () => {
  return (process.env.BACKEND_API || "").replace(/\/$/, "");
};

// Default cache revalidation time in seconds (1 hour)
const CACHE_REVALIDATE_SECONDS = 3600;

// Mock initial appointments data when backend is not responding or during development
const initialAppointments = [
  {
    appointment_id: "APT-8821",
    patient_id: "pat_5501",
    patient_name: "أحمد سالم بازهير",
    patient_phone: "+967771234567",
    doctor_id: "doc_01",
    doctor_name: "د. خالد السقاف",
    doctor_specialty: "استشاري جراحة عامة والمناظير",
    doctor_image: "",
    building: "المبنى الجديد - الدور الثالث (عيادة 302)",
    appointment_date: "2026-08-25",
    period: "الفترة الصباحية (10:30 ص)",
    period_type: "morning",
    appointment_number: 4,
    booking_channel: "online_app",
    status: "confirmed",
    price: "5000 ر.ي",
    notes: "متابعة نتائج الفحوصات المخبرية الدورية",
    created_at: "2026-08-19T10:15:00.000Z",
    confirmed_at: "2026-08-19T10:20:00.000Z",
  },
  {
    appointment_id: "APT-7634",
    patient_id: "pat_5501",
    patient_name: "أحمد سالم بازهير",
    patient_phone: "+967771234567",
    doctor_id: "doc_02",
    doctor_name: "د. أحمد بن محفوظ",
    doctor_specialty: "استشاري أمراض وجراحة القلب",
    doctor_image: "",
    building: "المبنى القديم - الدور الثاني (عيادة 205)",
    appointment_date: "2026-08-28",
    period: "الفترة المسائية (05:00 م)",
    period_type: "evening",
    appointment_number: 7,
    booking_channel: "online_app",
    status: "waiting",
    price: "6000 ر.ي",
    notes: "استشارة طبية وتخطيط قلب",
    created_at: "2026-08-18T14:30:00.000Z",
    confirmed_at: null,
  },
  {
    appointment_id: "APT-5412",
    patient_id: "pat_5501",
    patient_name: "أحمد سالم بازهير",
    patient_phone: "+967771234567",
    doctor_id: "doc_03",
    doctor_name: "د. فاطمة العمودي",
    doctor_specialty: "استشارية طب وجراحة العيون والليزك",
    doctor_image: "",
    building: "المبنى الجديد - الدور الرابع (عيادة 410)",
    appointment_date: "2026-08-10",
    period: "الفترة الصباحية (11:00 ص)",
    period_type: "morning",
    appointment_number: 12,
    booking_channel: "online_app",
    status: "completed",
    price: "4500 ر.ي",
    notes: "فحص قاع العين وتحديث مقاس النظارة",
    created_at: "2026-08-05T09:00:00.000Z",
    confirmed_at: "2026-08-05T09:15:00.000Z",
  },
  {
    appointment_id: "APT-4290",
    patient_id: "pat_5501",
    patient_name: "أحمد سالم بازهير",
    patient_phone: "+967771234567",
    doctor_id: "doc_05",
    doctor_name: "د. نادية الكثيري",
    doctor_specialty: "استشارية طب الأطفال ورعاية الخدج",
    doctor_image: "",
    building: "المبنى القديم - الدور الأول (عيادة 104)",
    appointment_date: "2026-07-22",
    period: "الفترة المسائية (04:30 م)",
    period_type: "evening",
    appointment_number: 3,
    booking_channel: "reception",
    status: "completed",
    price: "4000 ر.ي",
    notes: "فحص نمو روتيني وتطعيمات",
    created_at: "2026-07-20T11:00:00.000Z",
    confirmed_at: "2026-07-20T11:00:00.000Z",
  },
  {
    appointment_id: "APT-3108",
    patient_id: "pat_5501",
    patient_name: "أحمد سالم بازهير",
    patient_phone: "+967771234567",
    doctor_id: "doc_04",
    doctor_name: "د. محمد باوزير",
    doctor_specialty: "استشاري جراحة العظام والعمود الفقري",
    doctor_image: "",
    building: "المبنى الجديد - الدور الثاني (عيادة 212)",
    appointment_date: "2026-07-05",
    period: "الفترة الصباحية (09:30 ص)",
    period_type: "morning",
    appointment_number: 9,
    booking_channel: "online_app",
    status: "cancelled",
    price: "5500 ر.ي",
    notes: "تم إلغاء الموعد بناءً على طلب المريض لظروف السفر",
    created_at: "2026-07-01T16:20:00.000Z",
    confirmed_at: null,
  },
];

export const appointmentsService = {
  // Fetch patient appointments list with fallback support
  async getAppointments() {
    const backendApi = getBackendApi();
    if (!backendApi) return initialAppointments;

    try {
      const res = await fetch(`${backendApi}/appointments`, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["appointments"] },
      });
      if (!res.ok) return initialAppointments;
      const json = await res.json();
      return Array.isArray(json?.data) && json.data.length > 0
        ? json.data
        : initialAppointments;
    } catch {
      return initialAppointments;
    }
  },

  // Fetch single appointment details by ID
  async getAppointmentById(appointmentId) {
    const backendApi = getBackendApi();
    if (!appointmentId) return null;

    if (!backendApi) {
      return initialAppointments.find((item) => item.appointment_id === appointmentId) || null;
    }

    try {
      const res = await fetch(`${backendApi}/appointments/${encodeURIComponent(appointmentId)}`, {
        next: { revalidate: CACHE_REVALIDATE_SECONDS, tags: [`appointment-${appointmentId}`] },
      });
      if (!res.ok) {
        return initialAppointments.find((item) => item.appointment_id === appointmentId) || null;
      }
      const json = await res.json();
      return json?.data || null;
    } catch {
      return initialAppointments.find((item) => item.appointment_id === appointmentId) || null;
    }
  },

  // Cancel existing appointment
  async cancelAppointment(appointmentId) {
    const backendApi = getBackendApi();
    if (!backendApi || !appointmentId) return { success: true };

    try {
      const res = await fetch(`${backendApi}/appointments/${encodeURIComponent(appointmentId)}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      return { success: res.ok };
    } catch {
      return { success: false };
    }
  },
};

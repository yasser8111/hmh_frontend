"use client";

import { Stethoscope } from "lucide-react";
import { Card } from "@/components/ui";
import { formatArabicDate } from "@/app/app/booking/utils/bookingDateUtils";

const STATUS_CONFIG = {
  confirmed: {
    label: "مؤكد",
    badgeClass: "bg-emerald-50 text-emerald-800",
    dotClass: "bg-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-700",
  },
  waiting: {
    label: "قيد الانتظار",
    badgeClass: "bg-amber-50 text-amber-800",
    dotClass: "bg-amber-500",
    iconBg: "bg-amber-50 text-amber-700",
  },
  completed: {
    label: "مكتمل",
    badgeClass: "bg-primary-50 text-primary-800",
    dotClass: "bg-primary-500",
    iconBg: "bg-primary-50 text-primary-700",
  },
  cancelled: {
    label: "ملغي",
    badgeClass: "bg-rose-50 text-rose-800",
    dotClass: "bg-rose-500",
    iconBg: "bg-rose-50 text-rose-700",
  },
};

function formatPeriodArabic(period) {
  if (!period) return "";
  const p = period.toLowerCase();
  if (p === "morning" || p === "الصباح" || p === "صباحاً" || p === "صباحية") return "الصباح";
  if (p === "evening" || p === "المساء" || p === "مساءً" || p === "مسائية") return "المساء";
  return period;
}

export default function AppointmentCard({
  appointment,
  onCancel,
  className = "",
}) {
  if (!appointment) return null;

  const statusCfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.waiting;
  const isUpcoming = appointment.status === "confirmed" || appointment.status === "waiting";

  // Verified fields from OpenAPI schema: Arabic first, English fallback
  const doctorName =
    appointment.doctor_name_ar ||
    appointment.doctor_name_en ||
    appointment.doctor_name ||
    "غير مسجل";

  const specialty =
    appointment.doctor_specialty_ar ||
    appointment.doctor_specialty_en ||
    appointment.doctor_specialty ||
    "غير مسجل";

  const periodArabic = formatPeriodArabic(appointment.period);
  const patientName = appointment.patient_name || "";

  return (
    <Card
      link={`/app/appointments/${encodeURIComponent(appointment.appointment_id)}`}
      className={`w-full bg-white border-2 border-white hover:border-primary-300 p-4 sm:p-5 transition-all duration-200 shadow-2xs hover:shadow-xs group cursor-pointer block select-none active:scale-[0.99] ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Doctor Icon & Details */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${statusCfg.iconBg}`}
          >
            <Stethoscope className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            {/* Patient Name */}
            <h3 className="text-sm sm:text-base font-bold text-gray-950 truncate">
              {patientName}
            </h3>

            {/* Doctor Name & Specialty */}
            <p className="text-xs text-gray-500 font-medium truncate">
              {doctorName}
              {specialty && ` • ${specialty}`}
            </p>

            {/* Date & Period */}
            <p className="text-xs text-gray-600 font-medium truncate">
              {formatArabicDate(appointment.appointment_date)}
              {periodArabic && ` • ${periodArabic}`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusCfg.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
          <span>{statusCfg.label}</span>
        </span>

        {isUpcoming && onCancel && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel(appointment);
            }}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 z-10"
          >
            إلغاء الموعد
          </button>
        )}
      </div>
    </Card>
  );
}

export { AppointmentCard, AppointmentCard as QuickAppointmentCard };

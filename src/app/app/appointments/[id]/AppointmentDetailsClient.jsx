"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Building,
  Building2,
  User,
  Stethoscope,
  XCircle,
  StickyNote,
} from "lucide-react";
import { Card } from "@/components/ui";
import { CancelAppointmentModal } from "@/components/appointments";
import { formatArabicDate } from "@/app/app/booking/utils/bookingDateUtils";

const STATUS_CONFIG = {
  confirmed: {
    label: "مؤكد",
    badgeClass: "bg-emerald-50 text-emerald-800",
    dotClass: "bg-emerald-500",
  },
  waiting: {
    label: "قيد الانتظار",
    badgeClass: "bg-amber-50 text-amber-800",
    dotClass: "bg-amber-500",
  },
  completed: {
    label: "مكتمل",
    badgeClass: "bg-primary-50 text-primary-800",
    dotClass: "bg-primary-500",
  },
  cancelled: {
    label: "ملغي",
    badgeClass: "bg-rose-50 text-rose-800",
    dotClass: "bg-rose-500",
  },
};

function getPeriodDetails(period) {
  if (!period) return { label: "غير محدد", time: "" };
  const p = String(period).toLowerCase().trim();
  if (p === "morning" || p === "الصباح" || p === "صباحاً" || p === "صباحية" || p === "الفترة الصباحية") {
    return {
      label: "الفترة الصباحية",
      time: "8:30 صباحاً - 1:30 ظهراً",
    };
  }
  if (p === "evening" || p === "المساء" || p === "مساءً" || p === "مسائية" || p === "الفترة المسائية") {
    return {
      label: "الفترة المسائية",
      time: "4:30 عصراً - 9:30 مساءً",
    };
  }
  return { label: period, time: "" };
}

function formatBuildingArabic(building) {
  if (!building) return "المبنى الرئيسي";
  const b = String(building).toLowerCase().trim();
  if (b === "new" || b === "الجديد" || b === "المبنى الجديد") return "المبنى الجديد";
  if (b === "old" || b === "القديم" || b === "المبنى القديم") return "المبنى القديم";
  return building;
}

export default function AppointmentDetailsClient({ initialAppointment }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState(initialAppointment);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (!appointment) return null;

  const statusCfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.waiting;
  const isUpcoming = appointment.status === "confirmed" || appointment.status === "waiting";

  // Verified fields from OpenAPI schema: Arabic first, English fallback
  const doctorName =
    appointment.doctor_name_ar ||
    appointment.doctor_name_en ||
    appointment.doctor_name ||
    null;

  const specialty =
    appointment.doctor_specialty_ar ||
    appointment.doctor_specialty_en ||
    appointment.doctor_specialty ||
    null;

  const periodInfo = getPeriodDetails(appointment.period);
  const patientName = appointment.patient_name || null;
  const buildingName = formatBuildingArabic(appointment.building);

  const handleCancelSuccess = (updated) => {
    setAppointment(updated);
    setIsCancelModalOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Main Ticket Card */}
      <Card className="bg-white border-2 border-white p-5 sm:p-7 space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-950">
            معلومات وبيانات الموعد
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${statusCfg.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusCfg.dotClass}`} />
            <span>{statusCfg.label}</span>
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* 3. Unified Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Patient Name */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-gray-500" />
              <span>اسم المريض</span>
            </span>
            <span
              className={`text-sm sm:text-base block truncate ${patientName ? "font-bold text-gray-950" : "font-medium text-gray-400"
                }`}
            >
              {patientName || "غير مسجل"}
            </span>
          </div>

          {/* Doctor Name */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <Stethoscope className="w-4 h-4 text-gray-500" />
              <span>الطبيب</span>
            </span>
            <span
              className={`text-sm sm:text-base block truncate ${doctorName ? "font-bold text-gray-950" : "font-medium text-gray-400"
                }`}
            >
              {doctorName ? `د. ${doctorName}` : "غير متوفر"}
            </span>
          </div>

          {/* Department / Specialty */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span>القسم</span>
            </span>
            <span
              className={`text-sm sm:text-base block truncate ${specialty ? "font-bold text-gray-950" : "font-medium text-gray-400"
                }`}
            >
              {specialty || "غير متوفر"}
            </span>
          </div>

          {/* Date */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>تاريخ الموعد</span>
            </span>
            <span
              className={`text-sm sm:text-base block ${appointment.appointment_date ? "font-bold text-gray-950" : "font-medium text-gray-400"
                }`}
            >
              {appointment.appointment_date ? formatArabicDate(appointment.appointment_date) : "غير محدد"}
            </span>
          </div>

          {/* Period */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>فترة الحضور</span>
            </span>
            <span
              className={`text-sm sm:text-base block ${periodInfo.label !== "غير محدد" ? "font-bold text-gray-950" : "font-medium text-gray-400"
                }`}
            >
              {periodInfo.label}
            </span>
            {periodInfo.time && (
              <span className="text-xs text-primary-700 font-medium block">
                {periodInfo.time}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <Building className="w-4 h-4 text-gray-500" />
              <span>الموقع</span>
            </span>
            <span className="font-bold text-gray-950 text-sm sm:text-base block truncate">
              {buildingName}
            </span>
          </div>
        </div>

        {/* 4. Notes (if present) */}
        <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
          <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
            <StickyNote className="w-4 h-4 text-gray-500" />
            <span>ملاحظات الموعد</span>
          </span>
          <span
            className={`text-sm sm:text-base block truncate ${appointment.notes ? "font-bold text-gray-950" : "font-medium text-gray-400"
              }`}
          >
            {appointment.notes || "لا توجد ملاحظات"}
          </span>
        </div>

        {/* 5. Arrival Instructions Notice */}
        <div className="pt-4 border-t border-gray-100">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 text-xs text-amber-950 space-y-1.5 leading-relaxed">
            <span className="font-bold block text-amber-950">تعليمات الحضور:</span>
            <p>• يرجى التواجد بالعيادة قبل 15 دقيقة من الموعد لتأكيد الحضور بقسم الاستقبال.</p>
            <p>• إبراز رقم الهوية أو بيانات الحجز لموظف الاستقبال عند الوصول.</p>
          </div>
        </div>

        {/* Action Footer: Cancel Button Only (when upcoming) */}
        {isUpcoming && (
          <>
            <div className="border-t border-gray-100" />
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer active:scale-[0.99]"
              >
                <XCircle className="w-4 h-4" />
                <span>إلغاء الموعد</span>
              </button>
            </div>
          </>
        )}
      </Card>

      {/* Interactive Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        appointment={appointment}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}

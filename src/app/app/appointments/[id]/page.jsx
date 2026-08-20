import AppHeader from "@/components/layout/AppHeader";
import { appointmentsService } from "@/services/appointmentsService";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Building,
  User,
  Hash,
  Stethoscope,
  XCircle,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "تفاصيل الموعد الطبي | مستشفى حضرموت الحديث",
  description: "تفاصيل وبطاقة الموعد الطبي في مستشفى حضرموت الحديث",
};

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "إبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const STATUS_CONFIG = {
  confirmed: {
    label: "مؤكد",
    stripClass: "bg-emerald-100/70 border-emerald-300",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    textClass: "text-emerald-800",
    dotClass: "bg-emerald-600",
    iconBg: "bg-emerald-200/80 text-emerald-800",
    icon: CheckCircle2,
  },
  waiting: {
    label: "قيد الانتظار",
    stripClass: "bg-amber-100/70 border-amber-300",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    textClass: "text-amber-800",
    dotClass: "bg-amber-600",
    iconBg: "bg-amber-200/80 text-amber-800",
    icon: AlertCircle,
  },
  completed: {
    label: "مكتمل",
    stripClass: "bg-primary-100/70 border-primary-300",
    badgeClass: "bg-primary-100 text-primary-800 border-primary-300",
    textClass: "text-primary-800",
    dotClass: "bg-primary-600",
    iconBg: "bg-primary-200/80 text-primary-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "ملغي",
    stripClass: "bg-rose-100/70 border-rose-300",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
    textClass: "text-rose-800",
    dotClass: "bg-rose-600",
    iconBg: "bg-rose-200/80 text-rose-800",
    icon: XCircle,
  },
};

function formatArabicDate(dateString) {
  if (!dateString) return { formatted: "", day: "", month: "", year: "" };
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const month = ARABIC_MONTHS[monthIndex] || "";
      return {
        formatted: `${day} ${month} ${year}`,
        day,
        month,
        year,
      };
    }
  } catch {
    // Fallback
  }
  return { formatted: dateString, day: "", month: "", year: "" };
}

export default async function AppointmentDetailsPage({ params }) {
  const { id } = await params;
  const appointment = await appointmentsService.getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  const status = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.waiting;
  const isUpcoming = appointment.status === "confirmed" || appointment.status === "waiting";
  const dateInfo = formatArabicDate(appointment.appointment_date);

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      <AppHeader />

      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 lg:py-8 w-full space-y-5">
        {/* Back Link */}
        <div>
          <Link
            href="/app/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لسجل المواعيد</span>
          </Link>
        </div>

        {/* Main Appointment Ticket Card (Flat Design - No Shadows) */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
          {/* Card Top Header */}
          <div className="p-5 sm:p-6 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-950">
                  بطاقة الموعد الطبي
                </h1>
                <p className="text-xs text-gray-500 font-mono">
                  رقم الحجز: {appointment.appointment_id}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${status.badgeClass} border`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
              <span>{status.label}</span>
            </span>
          </div>

          {/* Body Information */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Doctor Info Highlight Strip */}
            <div className={`p-4 rounded-2xl border ${status.stripClass} flex items-center gap-3.5`}>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.iconBg}`}
              >
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] text-gray-600 font-medium">الطبيب المعالج</span>
                <h2 className="text-base sm:text-lg font-bold text-gray-950 truncate">
                  {appointment.doctor_name}
                </h2>
                <p className="text-xs text-gray-600 truncate mt-0.5">
                  {appointment.doctor_specialty}
                </p>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 text-[11px] flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  <span>اسم المريض</span>
                </span>
                <span className="font-bold text-gray-950 text-sm block">
                  {appointment.patient_name}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 text-[11px] flex items-center gap-1.5 font-medium">
                  <Hash className="w-3.5 h-3.5 text-gray-500" />
                  <span>رقم الدور</span>
                </span>
                <span className="font-extrabold text-primary-700 font-mono text-base block">
                  #{appointment.appointment_number}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 text-[11px] flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>تاريخ الموعد</span>
                </span>
                <span className="font-bold text-gray-950 text-sm block">
                  {dateInfo.formatted}
                </span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 text-[11px] flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>فترة الحضور</span>
                </span>
                <span className="font-bold text-gray-950 text-sm block">
                  {appointment.period}
                </span>
              </div>
            </div>

            {/* Clinic Location & Instructions */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <Building className="w-4 h-4 text-primary-600 shrink-0" />
                <span>{appointment.building || "المبنى الرئيسي - العيادات الخارجية"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs pt-2 border-t border-gray-200">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>يرجى التواجد قبل 15 دقيقة لتأكيد التسجيل بقسم الاستقبال.</span>
              </div>
            </div>

            {/* Notes if present */}
            {appointment.notes && (
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <span className="font-bold block">ملاحظات الحجز:</span>
                <p className="leading-relaxed">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Action Footer (Flat Design) */}
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/app/appointments"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمواعيد</span>
            </Link>

            <div className="flex items-center gap-2">
              {isUpcoming ? (
                <Link
                  href={`/app/appointments/${encodeURIComponent(appointment.appointment_id)}/cancel`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>إلغاء الموعد</span>
                </Link>
              ) : (
                <Link
                  href={`/app/booking?doctor_id=${appointment.doctor_id || ""}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>حجز مجدداً</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

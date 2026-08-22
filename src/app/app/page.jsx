import Link from "next/link";
import {
  Calendar,
  CalendarPlus,
  Stethoscope,
  Building2,
  Clock,
  ChevronLeft,
  User,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Clock3,
  MapPin,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Card, Button, TitlePage } from "@/components/ui";
import { QuickAppointmentCard } from "@/components/appointments/AppointmentCard";
import { appointmentsService } from "@/services/appointmentsService";
import { patientsService } from "@/services/patientsService";
import { formatArabicDate } from "./booking/utils/bookingDateUtils";

export const metadata = {
  title: "الرئيسية | مستشفى حضرموت الحديث",
  description: "لوحة التحكم الطبية لمستشفى حضرموت الحديث - حجز المواعيد ومتابعة الاستشارات",
};

function getStatusBadge(status) {
  switch (status) {
    case "confirmed":
      return {
        label: "مؤكد",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      };
    case "waiting":
    case "pending":
      return {
        label: "قيد الانتظار",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock3,
      };
    case "completed":
      return {
        label: "مكتمل",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CheckCircle2,
      };
    case "cancelled":
    case "rejected":
      return {
        label: "ملغي",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: AlertCircle,
      };
    default:
      return {
        label: status || "غير محدد",
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: Clock3,
      };
  }
}

export default async function AppPage() {
  // Fetch real patient appointments and user profile concurrently
  const [appointments, user] = await Promise.all([
    appointmentsService.getAppointments(),
    patientsService.getCurrentUser(),
  ]);

  const firstName = user?.full_name?.split(" ")[0] || "";

  // Find nearest upcoming active appointment
  const activeAppointments = appointments.filter(
    (item) => item.status === "confirmed" || item.status === "waiting" || item.status === "pending"
  );
  const nextAppointment = activeAppointments.sort(
    (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
  )[0];

  // Recent appointments list (up to 4)
  const recentAppointments = appointments.slice(0, 4);

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col pb-12">
      <AppHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 w-full space-y-7 sm:space-y-8">
        {/* Main Page Title (H1) */}
        <TitlePage
          as="h1"
          title={firstName ? `مرحباً بك، ${firstName}` : "مرحباً بك"}
        />

        {/* 2. Upcoming Appointment Hero Card */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span>الموعد القادم</span>
            </h2>
            {nextAppointment && (
              <Link
                href={`/app/appointments/${nextAppointment.appointment_id}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                <span>تفاصيل الحجز</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {nextAppointment ? (
            <div className="bg-white border-2 border-white hover:border-primary-300 rounded-2xl p-4 sm:p-6 shadow-xs transition-all duration-200 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Right side: Doctor and appointment details */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                    <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-gray-950">
                        {nextAppointment.doctor_name || "طبيب متخصص"}
                      </h3>
                      {(() => {
                        const badge = getStatusBadge(nextAppointment.status);
                        const StatusIcon = badge.icon;
                        return (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        );
                      })()}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600">
                      {nextAppointment.doctor_specialty || "استشاري عام"}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-gray-500 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                        <Calendar className="w-3.5 h-3.5 text-primary-500" />
                        {formatArabicDate(nextAppointment.appointment_date)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                        <Clock className="w-3.5 h-3.5 text-primary-500" />
                        {nextAppointment.period === "morning"
                          ? "الصباح"
                          : nextAppointment.period === "evening"
                            ? "المساء"
                            : nextAppointment.period}
                      </span>
                      {nextAppointment.building && (
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {nextAppointment.building}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left side actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    link={`/app/appointments/${nextAppointment.appointment_id}`}
                    className="flex-1 md:flex-none"
                  >
                    إدارة الموعد
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    link={`/app/appointments/${nextAppointment.appointment_id}/cancel`}
                    className="flex-1 md:flex-none text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    إلغاء الموعد
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card className="bg-white border-2 border-white p-6 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">لا توجد مواعيد قادمة</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  يمكنك حجز استشارتك الطبية واختيار الطبيب والتوقيت المناسب بكل سهولة ومتابعة حالة حجزك فوراً.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  startIcon={<CalendarPlus className="w-4 h-4" />}
                  link="/app/booking"
                >
                  احجز موعدك الطبي الآن
                </Button>
              </div>
            </Card>
          )}
        </section>

        {/* 3. Quick Actions (2x2 on Mobile, 4x1 on Desktop) */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            الخدمات والإجراءات السريعة
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Quick Action 1: New Booking */}
            <Card
              link="/app/booking"
              className="bg-white border-2 border-white hover:border-primary-300 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-[0.98] select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CalendarPlus className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
                  حجز موعد طبي
                </h3>
                <p className="text-xs text-gray-500">اختر الطبيب والوقت</p>
              </div>
            </Card>

            {/* Quick Action 2: Doctors Directory */}
            <Card
              link="/app/doctors"
              className="bg-white border-2 border-white hover:border-emerald-300 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-[0.98] select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-emerald-600 transition-colors">
                  دليل الأطباء
                </h3>
                <p className="text-xs text-gray-500">نخبة الاستشاريين</p>
              </div>
            </Card>

            {/* Quick Action 3: Medical Departments */}
            <Card
              link="/app/departments"
              className="bg-white border-2 border-white hover:border-amber-300 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-[0.98] select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-amber-600 transition-colors">
                  الأقسام والعيادات
                </h3>
                <p className="text-xs text-gray-500">كافة التخصصات الطبية</p>
              </div>
            </Card>

            {/* Quick Action 4: My Appointments */}
            <Card
              link="/app/appointments"
              className="bg-white border-2 border-white hover:border-purple-300 p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-xs active:scale-[0.98] select-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-purple-600 transition-colors">
                  سجل مواعيدي
                </h3>
                <p className="text-xs text-gray-500">
                  {appointments.length > 0
                    ? `${appointments.length} موعد مسجل`
                    : "متابعة الحجوزات"}
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* 4. Recent Appointments Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span>آخر الحجوزات والمواعيد</span>
            </h2>
            {appointments.length > 0 && (
              <Link
                href="/app/appointments"
                className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                <span>عرض الكل ({appointments.length})</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            )}
          </div>

          {recentAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentAppointments.map((appointment) => (
                <QuickAppointmentCard
                  key={appointment.appointment_id}
                  appointment={appointment}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white border-2 border-white p-6 text-center text-gray-400 text-sm">
              لا توجد حجوزات سابقة مسجلة.
            </Card>
          )}
        </section>

        {/* 5. 24/7 Emergency & Contact Banner */}
        <Card className="bg-white border-2 border-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5 text-right w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-gray-950 text-sm sm:text-base">
                طوارئ وإسعاف المستشفى على مدار 24 ساعة
              </h4>
              <p className="text-xs text-gray-500">
                للحالات الطارئة والاستفسارات العاجلة يمكنك التواصل مع مركز الاستقبال مباشرة
              </p>
            </div>
          </div>

          <a
            href="tel:05300000"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>اتصل بالطوارئ</span>
          </a>
        </Card>
      </div>
    </main>
  );
}

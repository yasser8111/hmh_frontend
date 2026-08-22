import Link from "next/link";
import {
  CalendarX2,
  Calendar,
  CalendarPlus,
  Building2,
  Clock,
  ChevronLeft,
  User,
  Stethoscope,
  PhoneCall,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Card, Button, TitlePage } from "@/components/ui";
import { AppointmentCard } from "@/components/appointments";
import { appointmentsService } from "@/services/appointmentsService";
import { patientsService } from "@/services/patientsService";

export const metadata = {
  title: "الرئيسية | مستشفى حضرموت الحديث",
  description: "لوحة التحكم الطبية لمستشفى حضرموت الحديث - حجز المواعيد ومتابعة الاستشارات",
};

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

  // Up to 4 recent appointments
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
            <AppointmentCard appointment={nextAppointment} />
          ) : (
            <Card className="bg-white border-2 border-white p-6 text-center space-y-3 -2xs lg:py-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center">
                <CalendarX2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">لا توجد مواعيد قادمة</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto text-balance">
                  يمكنك حجز استشارتك الطبية واختيار الطبيب والتوقيت المناسب بكل سهولة ومتابعة حالة حجزك فوراً.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  link="/app/booking"
                >
                  احجز موعدك الآن
                </Button>
              </div>
            </Card>
          )}
        </section>

        {/* 3. Quick Action Navigation Cards (2x2 Grid) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary-500" />
              <span>الخدمات الطبية السريعة</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Book New Appointment */}
            <Card
              link="/app/booking"
              className="bg-white border-2 border-white hover:border-primary-300 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-200 -2xs hover:-xs cursor-pointer block select-none active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
                  حجز موعد طبي
                </h3>
                <p className="text-xs text-gray-500">
                  اختيار الطبيب والموعد المناسب
                </p>
              </div>
            </Card>

            {/* Card 2: Doctors Guide */}
            <Card
              link="/app/doctors"
              className="bg-white border-2 border-white hover:border-primary-300 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-200 -2xs hover:-xs cursor-pointer block select-none active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
                  دليل الأطباء
                </h3>
                <p className="text-xs text-gray-500">
                  استعراض الاستشاريين والأطباء
                </p>
              </div>
            </Card>

            {/* Card 3: Medical Departments */}
            <Card
              link="/app/departments"
              className="bg-white border-2 border-white hover:border-primary-300 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-200 -2xs hover:-xs cursor-pointer block select-none active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
                  الأقسام والعيادات
                </h3>
                <p className="text-xs text-gray-500">
                  التخصصات والمراكز العلاجية
                </p>
              </div>
            </Card>

            {/* Card 4: Appointments Records */}
            <Card
              link="/app/appointments"
              className="bg-white border-2 border-white hover:border-primary-300 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-200 -2xs hover:-xs cursor-pointer block select-none active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950 text-sm sm:text-base group-hover:text-primary-600 transition-colors">
                  سجل المواعيد
                </h3>
                <p className="text-xs text-gray-500">
                  {appointments.length > 0
                    ? `${appointments.length} مواعيد مسجلة`
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
              <Clock className="w-5 h-5 text-primary-500" />
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
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointment_id}
                  appointment={appointment}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white border-2 border-white p-6 lg:p-12 text-center text-gray-400 text-sm">
              لا توجد حجوزات سابقة مسجلة.
            </Card>
          )}
        </section>

        {/* 5. 24/7 Emergency & Contact Banner */}
        <Card className="bg-white border-2 border-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
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

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  User,
  Stethoscope,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  Phone,
  Info,
  Users,
  CalendarCheck,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Card, Button } from "@/components/ui";
import { doctorsService } from "@/services/doctorsService";

const DAY_NAMES_AR = {
  Sun: "الأحد",
  Mon: "الإثنين",
  Tue: "الثلاثاء",
  Wed: "الأربعاء",
  Thu: "الخميس",
  Fri: "الجمعة",
  Sat: "السبت",
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const doctor = await doctorsService.getDoctorById(id);

  if (!doctor) {
    return {
      title: "تفاصيل الطبيب | مستشفى حضرموت الحديث",
    };
  }

  return {
    title: `${doctor.full_name_ar || "الطبيب"} | مستشفى حضرموت الحديث`,
    description: `تعرف على مواعيد دوام وتخصص ${doctor.full_name_ar} في مستشفى حضرموت الحديث واحجز موعدك مباشرة.`,
  };
}

export default async function DoctorDetailsPage({ params }) {
  const { id } = await params;

  const [doctor, scheduleData] = await Promise.all([
    doctorsService.getDoctorById(id),
    doctorsService.getDoctorSchedule(id),
  ]);

  if (!doctor) {
    notFound();
  }

  const scheduleList =
    (scheduleData && scheduleData.length > 0)
      ? scheduleData
      : (doctor.schedule || []);

  const specialtyName =
    doctor.specialty_name_ar || doctor.specialty?.name_ar || "عيادة متخصصة";

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      {/* 1. Header Navigation */}
      <AppHeader />

      {/* 2. Main Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 lg:py-8 w-full space-y-6">
        {/* 3. Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Profile Header Card */}
            <Card className="bg-white border-2 border-white p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {doctor.image ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary-50 overflow-hidden shrink-0 border border-primary-100 flex items-center justify-center">
                    <img
                      src={doctor.image}
                      alt={doctor.full_name_ar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
                    <User className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-950">
                      {doctor.full_name_ar}
                    </h1>
                  </div>

                  {doctor.specialty_name_ar && (
                    <p className="text-sm text-gray-500">
                      {doctor.specialty_name_ar}
                    </p>
                  )}

                  {doctor.building && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                        <Building className="w-3.5 h-3.5 text-gray-500" />
                        {doctor.building === "new" ? "المبنى الجديد" : "المبنى الرئيسي"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Weekly Schedule Card */}
            <Card className="bg-white border-2 border-white p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-950">
                    جدول الدوام الأسبوعي المعتمد
                  </h2>
                </div>
                <span className="text-xs text-gray-500">
                  {scheduleList.filter((s) => s.is_active).length} فترات عمل
                </span>
              </div>

              {scheduleList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scheduleList.map((slot) => {
                    const dayAr = DAY_NAMES_AR[slot.day_of_week] || slot.day_of_week;
                    const isMorning = slot.period?.toLowerCase() === "morning";
                    const isActive = slot.is_active !== false;

                    return (
                      <div
                        key={slot.schedule_id || `${slot.day_of_week}-${slot.period}`}
                        className={`p-4 rounded-2xl  transition-all flex items-center justify-between gap-3 ${isActive
                          ? "border-gray-200 bg-gray-50/50"
                          : "border-gray-100 bg-gray-50/20 opacity-50"
                          }`}
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-gray-900">
                            يوم {dayAr}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {isMorning
                              ? "الفترة الصباحية (8:30 ص - 1:30 م)"
                              : "الفترة المسائية (4:30 م - 9:30 م)"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl bg-gray-50 text-gray-500 text-xs">
                  يتم تحديد مواعيد الدوام بحسب الحجز المسبق لدى مكتب الاستقبال.
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar CTA Column (1 Col) */}
          <div className="space-y-6">
            {/* Quick Booking Card */}
            <Card className="bg-white border-2 border-white p-6 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-950">
                    حجز موعد مسبق
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  احجز دورك الطبي مع {doctor.full_name_ar} وتجنب فترات الانتظار الطويلة في العيادة.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  link={`/app/booking?doctor_id=${doctor.doctor_id}`}
                  variant="primary"
                  arrowIcon={true}
                  className="w-full justify-between"
                >
                  احجز موعدك الآن
                </Button>
              </div>

              {/* Attendance Instructions Note */}
              <div className="pt-4 border-t border-gray-100">
                <div className="p-3 rounded-2xl bg-amber-50 text-[11px] text-amber-900 space-y-1.5 leading-relaxed">
                  <span className="font-bold block text-amber-950">تنبيهات هامة:</span>
                  <p>• يرجى الحضور قبل الموعد بـ 15 دقيقة لتأكيد الدخول.</p>
                  <p>• ستصلك رسالة تأكيد الموعد ورقم الدور فور الحجز عبر الواتساب.</p>
                </div>
              </div>
            </Card>

            {/* Assistance Card */}
            <Card className="bg-white border-2 border-white p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary-600" />
                <h4 className="text-xs font-bold text-gray-900">
                  بحاجة لمساعدة أو استفسار؟
                </h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                فريق الاستقبال وخدمة المراجعين متواجد على مدار الساعة لخدمتكم ومساعدتكم.
              </p>
              <div className="pt-1">
                <Button
                  link="/app"
                  variant="outline"
                  arrowIcon={false}
                  className="text-xs w-full justify-center"
                >
                  العودة للرئيسية
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import {
  Calendar,
  ArrowUpLeft,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Card, Button } from "@/components/ui";

export function StatCard({
  link,
  stat,
  title,
  subtitle,
  statColor = "text-primary-900",
  className = "bg-primary-200/40 border-2 border-primary-100/80 hover:border-primary-300",
}) {
  return (
    <Card
      isSquare={true}
      link={link}
      className={`group p-3 lg:p-6 flex flex-col justify-end transition-all duration-300 ${className}`}
    >
      <span className={`text-4xl lg:text-5xl font-bold tracking-tight mb-2 ${statColor}`}>
        {stat}
      </span>
      <h4 className="text-gray-900 font-semibold text-lg">
        {title}
      </h4>
      {subtitle && (
        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1 transition-colors">
          <span>{subtitle}</span>
          <ArrowUpLeft className="w-3.5 h-3.5" />
        </p>
      )}
    </Card>
  );
}

export function Dashboard() {
  const appointments = [
    {
      appointment_id: "apt_101",
      patient_id: "pat_5501",
      patient_name: "أحمد سالم بازهير",
      patient_phone: "+967771234567",
      doctor_id: "doc_01",
      doctor_name: "د. خالد السقاف",
      appointment_date: "2026-08-18",
      period: "الفترة الصباحية (10:30 ص)",
      appointment_number: 4,
      booking_channel: "online_app",
      status: "waiting",
      created_by_staff_id: "sys_auto",
      created_at: "2026-08-15T10:15:00.000Z",
      confirmed_at: "2026-08-15T10:20:00.000Z",
    },
    {
      appointment_id: "apt_102",
      patient_id: "pat_5501",
      patient_name: "أحمد سالم بازهير",
      patient_phone: "+967771234567",
      doctor_id: "doc_02",
      doctor_name: "د. أحمد بن محفوظ",
      appointment_date: "2026-08-10",
      period: "الفترة المسائية (04:30 م)",
      appointment_number: 12,
      booking_channel: "online_app",
      status: "completed",
      created_by_staff_id: "sys_auto",
      created_at: "2026-08-08T09:00:00.000Z",
      confirmed_at: "2026-08-08T09:15:00.000Z",
    },
    {
      appointment_id: "apt_103",
      patient_id: "pat_5501",
      patient_name: "أحمد سالم بازهير",
      patient_phone: "+967771234567",
      doctor_id: "doc_03",
      doctor_name: "د. فاطمة العمودي",
      appointment_date: "2026-08-01",
      period: "الفترة الصباحية (11:00 ص)",
      appointment_number: 8,
      booking_channel: "reception",
      status: "cancelled",
      created_by_staff_id: "staff_reception_04",
      created_at: "2026-07-30T14:20:00.000Z",
      confirmed_at: null,
    },
    {
      appointment_id: "apt_104",
      patient_id: "pat_5501",
      patient_name: "أحمد سالم بازهير",
      patient_phone: "+967771234567",
      doctor_id: "doc_03",
      doctor_name: "د. فاطمة العمودي",
      appointment_date: "2026-08-01",
      period: "الفترة الصباحية (11:00 ص)",
      appointment_number: 8,
      booking_channel: "reception",
      status: "cancelled",
      created_by_staff_id: "staff_reception_04",
      created_at: "2026-07-30T14:20:00.000Z",
      confirmed_at: null,
    },
    {
      appointment_id: "apt_105",
      patient_id: "pat_5501",
      patient_name: "أحمد سالم بازهير",
      patient_phone: "+967771234567",
      doctor_id: "doc_03",
      doctor_name: "د. فاطمة العمودي",
      appointment_date: "2026-08-01",
      period: "الفترة الصباحية (11:00 ص)",
      appointment_number: 8,
      booking_channel: "reception",
      status: "cancelled",
      created_by_staff_id: "staff_reception_04",
      created_at: "2026-07-30T14:20:00.000Z",
      confirmed_at: null,
    },
  ];

  const stateStyles = {
    completed: "bg-emerald-50 border-2 border-emerald-50 hover:border-emerald-200/80 text-emerald-800",
    waiting: "bg-amber-50 border-2 border-amber-50 hover:border-amber-200/80 text-amber-800",
    cancelled: "bg-rose-50 border-2 border-rose-50 hover:border-rose-200/80 text-rose-800",
  };

  const nextAppointment = appointments.find(
    (item) => item.status !== "completed" && item.status !== "cancelled"
  );

  const arabicMonths = [
    "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const [, monthStr, dayStr] = nextAppointment?.appointment_date?.split("-") || [];
  const appointmentDay = dayStr || "18";
  const appointmentMonth = arabicMonths[parseInt(monthStr, 10) - 1] || "أغسطس";

  return (
    <section className="section grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-6">
      <Card className="bg-white row-span-2 lg:row-span-3 relative">
        <div className="absolute inset-0 p-3 lg:p-4 flex flex-col gap-2">
          <h4 className="text-primary-900 text-base mb-1 font-semibold shrink-0">سجل الحجوزات</h4>

          {appointments.length > 0 ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 pl-0.5">
              {appointments.map((appointment) => (
                <Card
                  link={`/app/appointments/${appointment.appointment_id}`}
                  key={appointment.appointment_id}
                  className={`p-2.5 lg:p-4 shrink-0 transition-colors ${stateStyles[appointment.status] || "bg-gray-50 border-2 hover:border-gray-200"}`}
                >
                  <h4 className="text-gray-950 text-sm font-semibold mb-1">{appointment.doctor_name}</h4>
                  <p className="text-gray-500 text-xs">{appointment.appointment_date} • {appointment.period}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl flex-1 flex flex-col items-center justify-center gap-2">
              <h4 className="text-gray-400">لا توجد حجوزات</h4>
              <Button variant="secondary" arrowIcon={false} link="/app/booking" className="scale-75 w-full">احجز الآن</Button>
            </div>
          )}
        </div>
      </Card>

      <StatCard
        link="/app/departments"
        stat="+15"
        title="قسماً وعيادة"
        subtitle="استكشف الأقسام"
        statColor="text-primary-900"
        className="bg-primary-200/40 border-2 border-primary-100/80 hover:border-primary-300"
      />

      <StatCard
        link="/app/doctors"
        stat="+70"
        title="طبيباً واستشارياً"
        subtitle="دليل الأطباء والكوادر"
        statColor="text-emerald-900"
        className="bg-emerald-100/40 border-2 border-emerald-100/40 hover:border-emerald-300"
      />

      <Card
        link={nextAppointment ? `/app/appointments/${nextAppointment.appointment_id}` : "/app/booking"}
        className="group col-span-2 bg-white border-2 border-white p-5 flex flex-col justify-between transition-all duration-300 hover:border-primary-300"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-primary-900 text-base font-semibold">موعدك القادم</h4>
        </div>

        {nextAppointment ? (
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 text-xs text-gray-500">
              <span className="text-gray-700 font-medium">
                الدكتور: {nextAppointment.doctor_name}
              </span>
              <span className="text-gray-700 font-medium">
                المريض: {nextAppointment.patient_name}
              </span>
              <span className="text-gray-700 font-medium">
                الفترة: {nextAppointment.period}
              </span>
              <span className={`font-semibold ${nextAppointment.status === "waiting" ? "text-amber-600" : "text-emerald-600"}`}>
                الحالة: {nextAppointment.status === "waiting" ? "قيد الانتظار" : "مؤكد"}
              </span>
            </div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary-50 flex flex-col items-center justify-center text-center shrink-0">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">موعدك</span>
              <span className="text-xl sm:text-2xl font-black text-primary-900 leading-none my-1">
                {appointmentDay}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {appointmentMonth}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
            <h4 className="text-gray-400">لا توجد حجوزات</h4>
          </div>
        )}
      </Card>

      <StatCard
        link="/app/profile"
        stat="100%"
        title="الملف الشخصي"
        subtitle="بياناتك الشخصية"
        statColor="text-amber-900"
        className="bg-amber-100/40 border-2 border-amber-100/40 hover:border-amber-300"
      />

      <Card isSquare={true} link={"/app/doctors"} className="bg-white row-span-2 col-span-2">
      </Card>

      <Card isSquare={true} link={"/app/doctors"} className="bg-white">
      </Card>

      <Card isSquare={true} link={"/app/doctors"} className="bg-white">
      </Card>

      <Card isSquare={true} link={"/app/doctors"} className="bg-white">
      </Card>

      <Card isSquare={true} link={"/app/doctors"} className="bg-white">
      </Card>

      <Card isSquare={true} link={"/app/doctors"} className="bg-white">
      </Card>

      <Card isSquare={true} link={"/app/doctors"} className="bg-white">
      </Card>
    </section>
  );
}

export default function AppPage() {
  return (
    <main className="bg-primary-50/50">
      <AppHeader />
      <Dashboard />
    </main>
  );
}

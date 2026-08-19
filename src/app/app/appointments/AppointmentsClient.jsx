"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Printer,
  Eye,
  X,
  FileText,
  CalendarCheck,
  Building,
  RotateCcw,
  Sparkles,
  Layers,
  LayoutGrid,
  ListFilter,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

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
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  waiting: {
    label: "قيد الانتظار",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
    iconClass: "text-amber-600",
  },
  completed: {
    label: "مكتمل",
    badgeClass: "bg-primary-50 text-primary-700 border-primary-200",
    icon: CalendarCheck,
    iconClass: "text-primary-600",
  },
  cancelled: {
    label: "ملغي",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
    iconClass: "text-rose-600",
  },
};

// Format date helper for Arabic display
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
    // Fallback if parsing fails
  }
  return { formatted: dateString, day: "", month: "", year: "" };
}

export default function AppointmentsClient({ initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelingAppointment, setCancelingAppointment] = useState(null);
  const [isCancelProcessing, setIsCancelProcessing] = useState(false);

  // Compute status counts for stat cards and tab badges
  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(
      (item) => item.status === "confirmed" || item.status === "waiting"
    ).length;
    const completed = appointments.filter((item) => item.status === "completed").length;
    const cancelled = appointments.filter((item) => item.status === "cancelled").length;

    return { total, upcoming, completed, cancelled };
  }, [appointments]);

  // Find the primary next upcoming appointment
  const nextAppointment = useMemo(() => {
    return appointments.find(
      (item) => item.status === "confirmed" || item.status === "waiting"
    );
  }, [appointments]);

  // Filter appointments based on active tab and search query
  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // Status filter
      if (activeTab === "upcoming") {
        if (item.status !== "confirmed" && item.status !== "waiting") return false;
      } else if (activeTab === "completed") {
        if (item.status !== "completed") return false;
      } else if (activeTab === "cancelled") {
        if (item.status !== "cancelled") return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      const matchDoctor = item.doctor_name?.toLowerCase().includes(query);
      const matchSpecialty = item.doctor_specialty?.toLowerCase().includes(query);
      const matchId = item.appointment_id?.toLowerCase().includes(query);
      const matchDate = item.appointment_date?.includes(query);

      return matchDoctor || matchSpecialty || matchId || matchDate;
    });
  }, [appointments, activeTab, searchQuery]);

  // Handle appointment cancellation
  const handleConfirmCancel = async () => {
    if (!cancelingAppointment) return;
    setIsCancelProcessing(true);

    // Update appointment status locally
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((item) =>
          item.appointment_id === cancelingAppointment.appointment_id
            ? { ...item, status: "cancelled", notes: "تم إلغاء الموعد بناءً على طلب المريض" }
            : item
        )
      );
      setIsCancelProcessing(false);
      setCancelingAppointment(null);
    }, 400);
  };

  // Handle print ticket
  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Action */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>إدارة الحجوزات الطبية</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            سجل المواعيد والحجوزات
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            تتبع مواعيدك الطبية القادمة، واطلع على سجل مراجعاتك السابقة وتفاصيل بطاقات الكشف بكل سهولة ويسر.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Button
            link="/app/booking"
            variant="primary"
            arrowIcon={true}
            className="w-full sm:w-auto"
          >
            حجز موعد جديد
          </Button>
        </div>
      </section>

      {/* 2. Stats Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Card */}
        <Card className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-gray-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">إجمالي الحجوزات</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</span>
            <span className="text-xs text-gray-500 font-medium">موعداً</span>
          </div>
        </Card>

        {/* Upcoming / Active Card */}
        <Card className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-700">المواعيد القادمة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.upcoming}</span>
            <span className="text-xs text-emerald-600/80 font-medium">موعد نشط</span>
          </div>
        </Card>

        {/* Completed Card */}
        <Card className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-primary-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary-700">المكتملة</span>
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-primary-600">{stats.completed}</span>
            <span className="text-xs text-primary-600/80 font-medium">تمت زيارتها</span>
          </div>
        </Card>

        {/* Cancelled Card */}
        <Card className="bg-white border border-gray-200 p-4 sm:p-5 flex flex-col justify-between transition-all hover:border-rose-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-rose-700">الملغية</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-rose-600">{stats.cancelled}</span>
            <span className="text-xs text-rose-600/80 font-medium">موعد ملغي</span>
          </div>
        </Card>
      </section>

      {/* 3. Next Upcoming Appointment Spotlight (if exists) */}
      {nextAppointment && (
        <section className="bg-white rounded-2xl border-2 border-primary-200 p-5 sm:p-6 lg:p-7 relative overflow-hidden transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500 text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  موعدك القادم الأقرب
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  رقم الحجز: <span className="font-mono text-gray-800">{nextAppointment.appointment_id}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {nextAppointment.doctor_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    {nextAppointment.doctor_specialty}
                  </p>
                </div>
              </div>

              {/* Badges Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700">
                  <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="font-medium">{formatArabicDate(nextAppointment.appointment_date).formatted}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700">
                  <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="font-medium">{nextAppointment.period}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700">
                  <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="font-medium truncate">{nextAppointment.building || "المبنى الرئيسي"}</span>
                </div>
              </div>
            </div>

            {/* Turn Number & Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 border-t lg:border-t-0 lg:border-s border-gray-200 pt-4 lg:pt-0 lg:ps-6">
              <div className="flex items-center gap-3 text-center">
                <div className="p-3 bg-primary-50 rounded-2xl border border-primary-100 min-w-[100px]">
                  <span className="block text-[11px] font-semibold text-primary-700">رقم الدور</span>
                  <span className="text-2xl font-black text-primary-900 leading-tight">
                    #{nextAppointment.appointment_number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(nextAppointment)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-all cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>عرض التذكرة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCancelingAppointment(nextAppointment)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-700 transition-all cursor-pointer active:scale-95"
                >
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Filter Tabs, Search & View Controls */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              الكل ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              القادمة والنشطة ({stats.upcoming})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "completed"
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              المكتملة ({stats.completed})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cancelled")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "cancelled"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              الملغية ({stats.cancelled})
            </button>
          </div>

          {/* Search Bar & View Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Live Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالطبيب أو التخصص..."
                className="w-full pr-9 pl-4 py-2 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-primary-500 rounded-xl text-xs text-gray-900 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="عرض شبكي"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-primary-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="عرض قائمة"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-white text-primary-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Appointments List Feed */}
      {filteredAppointments.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredAppointments.map((appointment) => {
              const statusCfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.waiting;
              const StatusIcon = statusCfg.icon;
              const dateInfo = formatArabicDate(appointment.appointment_date);
              const isUpcoming = appointment.status === "confirmed" || appointment.status === "waiting";

              return (
                <Card
                  key={appointment.appointment_id}
                  className="bg-white border border-gray-200 p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:border-gray-300 hover:shadow-xs"
                >
                  {/* Card Header: ID & Status Badge */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <span className="text-xs font-semibold font-mono text-gray-500">
                      {appointment.appointment_id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusCfg.label}</span>
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {appointment.doctor_name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {appointment.doctor_specialty}
                      </p>
                    </div>
                  </div>

                  {/* Date & Location Grid */}
                  <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">التاريخ:</span>
                      <span className="font-semibold text-gray-900">{dateInfo.formatted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الفترة:</span>
                      <span className="font-semibold text-gray-900">{appointment.period}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">رقم الدور:</span>
                      <span className="font-bold text-primary-600 font-mono">#{appointment.appointment_number}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(appointment)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>التفاصيل والتذكرة</span>
                    </button>

                    {isUpcoming ? (
                      <button
                        type="button"
                        onClick={() => setCancelingAppointment(appointment)}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        إلغاء
                      </button>
                    ) : (
                      <Link
                        href={`/app/booking?doctor_id=${appointment.doctor_id || ""}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>حجز مجدداً</span>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List / Table View */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 text-start">رقم الحجز</th>
                    <th className="py-3.5 px-4 text-start">الطبيب والتخصص</th>
                    <th className="py-3.5 px-4 text-start">التاريخ والفترة</th>
                    <th className="py-3.5 px-4 text-start">رقم الدور</th>
                    <th className="py-3.5 px-4 text-start">الحالة</th>
                    <th className="py-3.5 px-4 text-end">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAppointments.map((appointment) => {
                    const statusCfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.waiting;
                    const StatusIcon = statusCfg.icon;
                    const dateInfo = formatArabicDate(appointment.appointment_date);
                    const isUpcoming = appointment.status === "confirmed" || appointment.status === "waiting";

                    return (
                      <tr
                        key={appointment.appointment_id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-900">
                          {appointment.appointment_id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{appointment.doctor_name}</div>
                          <div className="text-gray-500 text-[11px]">{appointment.doctor_specialty}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-gray-900">{dateInfo.formatted}</div>
                          <div className="text-gray-500 text-[11px]">{appointment.period}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold font-mono text-primary-600">
                          #{appointment.appointment_number}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{statusCfg.label}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-end">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedTicket(appointment)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
                            >
                              التذكرة
                            </button>
                            {isUpcoming && (
                              <button
                                type="button"
                                onClick={() => setCancelingAppointment(appointment)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                إلغاء
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <section className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              لا توجد حجوزات مطابقة
            </h3>
            <p className="text-xs text-gray-500">
              {searchQuery
                ? "لم يتم العثور على أي موعد يطابق معايير البحث المدخلة."
                : "ليس لديك أي مواعيد في هذا التصنيف حالياً."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all cursor-pointer"
              >
                مسح البحث
              </button>
            ) : (
              <Button
                link="/app/booking"
                variant="primary"
                arrowIcon={false}
                className="text-xs"
              >
                احجز موعدك الآن
              </Button>
            )}
          </div>
        </section>
      )}

      {/* 6. Appointment Ticket Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden transition-all my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">بطاقة الموعد الطبي</h3>
                  <p className="text-[11px] text-gray-500 font-mono">
                    {selectedTicket.appointment_id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ticket Body Content */}
            <div className="p-6 space-y-5">
              {/* Doctor & Patient Strip */}
              <div className="p-4 bg-primary-50/60 rounded-2xl border border-primary-100/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] text-gray-500">الطبيب المعالج</span>
                    <span className="text-sm font-bold text-gray-900">{selectedTicket.doctor_name}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      (STATUS_CONFIG[selectedTicket.status] || STATUS_CONFIG.waiting).badgeClass
                    }`}
                  >
                    {(STATUS_CONFIG[selectedTicket.status] || STATUS_CONFIG.waiting).label}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {selectedTicket.doctor_specialty}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="block text-gray-400 text-[10px]">اسم المريض</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{selectedTicket.patient_name}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="block text-gray-400 text-[10px]">رقم الدور</span>
                  <span className="font-bold text-primary-600 text-sm mt-0.5 block">
                    #{selectedTicket.appointment_number}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="block text-gray-400 text-[10px]">تاريخ الموعد</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {formatArabicDate(selectedTicket.appointment_date).formatted}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="block text-gray-400 text-[10px]">الفترة الزمنية</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{selectedTicket.period}</span>
                </div>
              </div>

              {/* Location & Instructions */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="font-medium">{selectedTicket.building || "المبنى الرئيسي - العيادات الخارجية"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-[11px] pt-1 border-t border-gray-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>يرجى التواجد قبل 15 دقيقة لتأكيد التسجيل بقسم الاستقبال.</span>
                </div>
              </div>

              {/* Notes if present */}
              {selectedTicket.notes && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                  <span className="font-semibold block mb-0.5">ملاحظات الحجز:</span>
                  <span>{selectedTicket.notes}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrintTicket}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-500 hover:bg-primary-600 text-white transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التذكرة</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Cancel Confirmation Modal */}
      {cancelingAppointment && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isCancelProcessing && setCancelingAppointment(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-sm w-full p-6 space-y-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">تأكيد إلغاء الموعد</h3>
              <p className="text-xs text-gray-600">
                هل أنت متأكد من رغبتك في إلغاء الموعد مع{" "}
                <span className="font-semibold text-gray-900">{cancelingAppointment.doctor_name}</span>؟
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 text-start space-y-1">
              <div>
                <span className="text-gray-400">التاريخ: </span>
                <span className="font-semibold text-gray-800">
                  {formatArabicDate(cancelingAppointment.appointment_date).formatted}
                </span>
              </div>
              <div>
                <span className="text-gray-400">الفترة: </span>
                <span className="font-semibold text-gray-800">{cancelingAppointment.period}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isCancelProcessing}
                onClick={handleConfirmCancel}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {isCancelProcessing ? "جاري الإلغاء..." : "نعم، إلغاء الموعد"}
              </button>
              <button
                type="button"
                disabled={isCancelProcessing}
                onClick={() => setCancelingAppointment(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

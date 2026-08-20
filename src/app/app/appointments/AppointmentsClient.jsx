"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui";

const STATUS_CONFIG = {
  confirmed: {
    label: "مؤكد",
    stripClass: "bg-emerald-100/70 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-100/90",
    textClass: "text-emerald-800",
    dotClass: "bg-emerald-600",
    iconBg: "bg-emerald-200/80 text-emerald-800",
    icon: CheckCircle2,
  },
  waiting: {
    label: "قيد الانتظار",
    stripClass: "bg-amber-100/70 border-amber-300 hover:border-amber-400 hover:bg-amber-100/90",
    textClass: "text-amber-800",
    dotClass: "bg-amber-600",
    iconBg: "bg-amber-200/80 text-amber-800",
    icon: AlertCircle,
  },
  completed: {
    label: "مكتمل",
    stripClass: "bg-primary-100/70 border-primary-300 hover:border-primary-400 hover:bg-primary-100/90",
    textClass: "text-primary-800",
    dotClass: "bg-primary-600",
    iconBg: "bg-primary-200/80 text-primary-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "ملغي",
    stripClass: "bg-rose-100/70 border-rose-300 hover:border-rose-400 hover:bg-rose-100/90",
    textClass: "text-rose-800",
    dotClass: "bg-rose-600",
    iconBg: "bg-rose-200/80 text-rose-800",
    icon: XCircle,
  },
};

export default function AppointmentsClient({ initialAppointments = [] }) {
  const [appointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Compute status counts for tab badges
  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(
      (item) => item.status === "confirmed" || item.status === "waiting"
    ).length;
    const completed = appointments.filter((item) => item.status === "completed").length;
    const cancelled = appointments.filter((item) => item.status === "cancelled").length;

    return { total, upcoming, completed, cancelled };
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

  return (
    <div className="space-y-5">
      {/* 1. Filter Tabs & Search Bar */}
      <section className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary-500 text-white"
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
                  ? "bg-emerald-600 text-white"
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
                  ? "bg-primary-500 text-white"
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
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              الملغية ({stats.cancelled})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 md:max-w-xs">
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
        </div>
      </section>

      {/* 2. Appointments Strips Feed (Clicking links directly to /app/appointments/[id]) */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-2.5">
          {filteredAppointments.map((appointment) => {
            const statusCfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.waiting;

            return (
              <Link
                key={appointment.appointment_id}
                href={`/app/appointments/${encodeURIComponent(appointment.appointment_id)}`}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer select-none active:scale-[0.99] block ${statusCfg.stripClass}`}
              >
                {/* Right side: Doctor Icon + Doctor Name + Specialty */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${statusCfg.iconBg}`}
                  >
                    <Stethoscope className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-gray-950 truncate">
                      {appointment.doctor_name}
                    </h4>
                    <p className="text-xs text-gray-600 font-medium truncate mt-0.5">
                      {appointment.doctor_specialty}
                    </p>
                  </div>
                </div>

                {/* Left side: Status badge + Arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${statusCfg.textClass} px-2.5 py-1 rounded-xl bg-white/80 border border-white`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                    <span>{statusCfg.label}</span>
                  </span>
                  <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
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
    </div>
  );
}

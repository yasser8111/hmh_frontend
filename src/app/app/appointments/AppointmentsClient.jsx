"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button, Card, SearchBar } from "@/components/ui";
import {
  QuickAppointmentCard,
  CancelAppointmentModal,
  EmptyAppointments,
} from "@/components/appointments";

const STAT_ITEMS = [
  {
    id: "all",
    label: "إجمالي المواعيد",
    icon: Calendar,
    countKey: "total",
    textColor: "text-gray-500",
    iconBg: "bg-gray-100 text-gray-600",
    activeClass: "bg-white border-primary-500",
    inactiveClass: "bg-white border-white hover:border-gray-200",
  },
  {
    id: "upcoming",
    label: "القادمة والنشطة",
    icon: Clock,
    countKey: "upcoming",
    textColor: "text-emerald-800",
    iconBg: "bg-emerald-100 text-emerald-700",
    activeClass: "bg-emerald-50/80 border-emerald-500",
    inactiveClass: "bg-white border-white hover:border-emerald-200",
  },
  {
    id: "completed",
    label: "المكتملة",
    icon: CheckCircle2,
    countKey: "completed",
    textColor: "text-primary-800",
    iconBg: "bg-primary-100 text-primary-700",
    activeClass: "bg-primary-50/80 border-primary-500",
    inactiveClass: "bg-white border-white hover:border-primary-200",
  },
  {
    id: "cancelled",
    label: "الملغية",
    icon: XCircle,
    countKey: "cancelled",
    textColor: "text-rose-800",
    iconBg: "bg-rose-100 text-rose-700",
    activeClass: "bg-rose-50/80 border-rose-500",
    inactiveClass: "bg-white border-white hover:border-rose-200",
  },
];

export default function AppointmentsClient({ initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelingAppointment, setCancelingAppointment] = useState(null);

  // Status counts for cards and tabs
  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter(
      (item) => item.status === "confirmed" || item.status === "waiting"
    ).length;
    const completed = appointments.filter((item) => item.status === "completed").length;
    const cancelled = appointments.filter((item) => item.status === "cancelled").length;

    return { total, upcoming, completed, cancelled };
  }, [appointments]);

  // Update appointment status locally when cancelled
  const handleCancelSuccess = useCallback((cancelledId) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.appointment_id === cancelledId ? { ...appt, status: "cancelled" } : appt
      )
    );
  }, []);

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
      const matchPatient = item.patient_name?.toLowerCase().includes(query);

      return matchDoctor || matchSpecialty || matchId || matchDate || matchPatient;
    });
  }, [appointments, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Quick Summary Stats Cards using STAT_ITEMS mapping */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STAT_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Card
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab(item.id)}
              onKeyDown={(e) => e.key === "Enter" && setActiveTab(item.id)}
              className={`p-4 border-2 text-right transition-all cursor-pointer select-none active:scale-[0.98] ${
                isActive ? item.activeClass : item.inactiveClass
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${item.textColor}`}>
                  {item.label}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-gray-950 mt-2">
                {stats[item.countKey]}
              </p>
            </Card>
          );
        })}
      </section>

      {/* 2. Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="ابحث بالطبيب، التخصص أو رقم الحجز..."
        size="md"
      />

      {/* 3. Quick Appointments Full-Width Feed */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-3 w-full">
          {filteredAppointments.map((appointment) => (
            <QuickAppointmentCard
              key={appointment.appointment_id}
              appointment={appointment}
              onCancel={(appt) => setCancelingAppointment(appt)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <EmptyAppointments
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />
      )}

      {/* 4. Cancel Appointment Interactive Modal */}
      <CancelAppointmentModal
        isOpen={Boolean(cancelingAppointment)}
        onClose={() => setCancelingAppointment(null)}
        appointment={cancelingAppointment}
        onSuccess={handleCancelSuccess}
      />
    </div>
  );
}

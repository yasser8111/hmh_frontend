"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  CalendarCheck2,
  CalendarX2,
  LogOut,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function ProfileClient({ profile, appointments = [] }) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [clientAvatar, setClientAvatar] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_avatar");
      if (stored) setClientAvatar(stored);
    } catch {}
  }, []);

  const fullName = profile?.full_name || "غير مسجل";
  const userImage = profile?.picture || profile?.image || profile?.avatar || clientAvatar || null;
  const phone = profile?.phone || null;
  const email = profile?.email || null;
  const role = profile?.role === "patient" ? "ملف المريض الإلكتروني" : profile?.role || "مستخدم";

  // Real statistics derived from appointments
  const totalAppointments = appointments.length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "rejected"
  ).length;
  const completedAppointments = appointments.filter((a) => a.status === "completed").length;

  const handleCopy = async (text, fieldName) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      try {
        localStorage.removeItem("user_avatar");
      } catch {}
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Hero Profile Card */}
      <Card className="bg-white border-2 border-white p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Avatar & User Name */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            {userImage && !imageError ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-primary-50 shrink-0">
                <img
                  src={userImage}
                  alt={fullName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-950 truncate">
                {fullName}
              </h2>
            </div>
          </div>

          {/* Logout Action Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                <span className="hidden lg:block">جاري الخروج...</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:block">تسجيل الخروج</span>
              </>
            )}
          </button>
        </div>
      </Card>

      {/* 2. Appointments Activity Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Appointments */}
        <Card className="bg-white border-2 border-white p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-medium">إجمالي المواعيد</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-950 block">
              {totalAppointments}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </Card>

        {/* Cancelled Appointments */}
        <Card className="bg-white border-2 border-white p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-medium">المواعيد الملغية</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-950 block">
              {cancelledAppointments}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <CalendarX2 className="w-5 h-5" />
          </div>
        </Card>

        {/* Completed Appointments */}
        <Card className="bg-white border-2 border-white p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-medium">المكتملة</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-950 block">
              {completedAppointments}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 3. Personal & Contact Information Card */}
      <Card className="bg-white border-2 border-white p-5 sm:p-6 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-950 border-b border-gray-100 pb-3">
          البيانات الشخصية ومعلومات الاتصال
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Full Name */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-gray-500" />
              <span>الاسم الكامل</span>
            </span>
            <span className="font-bold text-gray-950 text-sm sm:text-base block truncate">
              {fullName}
            </span>
          </div>

          {/* Phone Number */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1 relative group">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>رقم الهاتف</span>
              </span>
              {phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(phone, "phone")}
                  aria-label="نسخ رقم الهاتف"
                  className="text-gray-400 hover:text-primary-600 transition-colors p-1 cursor-pointer"
                >
                  {copiedField === "phone" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
            <span
              className={`text-sm sm:text-base block font-mono ${
                phone ? "font-bold text-gray-950" : "font-medium text-gray-400"
              }`}
              dir="ltr"
            >
              {phone || "غير متوفر"}
            </span>
          </div>

          {/* Email */}
          <div className="p-4 bg-gray-50/70 rounded-2xl space-y-1 sm:col-span-2">
            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>البريد الإلكتروني</span>
            </span>
            <span
              className={`text-sm sm:text-base block truncate ${
                email ? "font-bold text-gray-950" : "font-medium text-gray-400"
              }`}
            >
              {email || "غير مسجل"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

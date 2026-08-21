import { cookies } from "next/headers";
import { User, Phone, Mail, Shield, Calendar, Clock, LogOut, CheckCircle2, ChevronLeft } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { Card, Button } from "@/components/ui";
import Link from "next/link";

export const metadata = {
  title: "الملف الشخصي | مستشفى حضرموت الحديث",
  description: "بيانات الحساب والملف الطبي للمريض",
};

const backendApi = process.env.BACKEND_API;

async function getMeProfile() {
  if (!backendApi) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${backendApi}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const profile = await getMeProfile();

  return (
    <main className="min-h-screen bg-gray-50/60 flex flex-col pb-12">
      <AppHeader />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-50 border-2 border-primary-100 flex items-center justify-center text-primary-600 shrink-0">
            <User className="w-10 h-10" />
          </div>

          <div className="space-y-1 text-center sm:text-right flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-950">
                {profile?.full_name || "المريض"}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                حساب نشط
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              {profile?.role === "patient" ? "ملف المريض الإلكتروني" : profile?.role || "مستخدم"}
            </p>
          </div>

          <div className="pt-2 sm:pt-0">
            <form action="/api/auth/logout" method="POST">
              <Button
                variant="secondary"
                size="sm"
                startIcon={<LogOut className="w-4 h-4 text-rose-600" />}
                type="submit"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                تسجيل الخروج
              </Button>
            </form>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-950 border-b border-gray-100 pb-3">
            المعلومات الشخصية وبيانات التواصل
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-primary-500" />
                رقم الهاتف المسجل
              </span>
              <p className="text-sm font-bold text-gray-900" dir="ltr">
                {profile?.phone || "غير متوفر"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-primary-500" />
                البريد الإلكتروني
              </span>
              <p className="text-sm font-bold text-gray-900">
                {profile?.email || "غير مسجل"}
              </p>
            </div>

            {profile?.patient_id && (
              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-primary-500" />
                  رقم الملف الطبي (Patient ID)
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {profile.patient_id}
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary-500" />
                إجمالي المواعيد
              </span>
              <p className="text-sm font-bold text-gray-900">
                {profile?.appointments?.length || 0} موعد مسجل
              </p>
            </div>

          </div>
        </div>

        {/* Quick Link to Appointments */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-950">سجل مواعيدي وحجوزاتي</h3>
              <p className="text-xs text-gray-500">استعراض وتتبع كافة المواعيد الحالية والسابقة</p>
            </div>
          </div>

          <Link
            href="/app/appointments"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-bold border border-gray-200 transition-colors"
          >
            <span>استعراض المواعيد</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

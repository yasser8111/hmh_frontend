import AppHeader from "@/components/layout/AppHeader";
import { TitlePage } from "@/components/ui";
import { patientsService } from "@/services/patientsService";
import { appointmentsService } from "@/services/appointmentsService";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "الملف الشخصي | مستشفى حضرموت الحديث",
  description: "بيانات الحساب والملف الطبي للمريض في مستشفى حضرموت الحديث",
};

export default async function ProfilePage() {
  const [profile, appointments] = await Promise.all([
    patientsService.getCurrentUser(),
    appointmentsService.getAppointments(),
  ]);

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col pb-12">
      {/* 1. App Navigation Header */}
      <AppHeader />

      {/* 2. Page Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full space-y-4 sm:space-y-6">
        <TitlePage
          title="الملف الشخصي"
          backLink="/app"
          backLabel="الرئيسية"
        />
        <ProfileClient profile={profile} appointments={appointments} />
      </div>
    </main>
  );
}

import AppHeader from "@/components/layout/AppHeader";
import { appointmentsService } from "@/services/appointmentsService";
import { notFound } from "next/navigation";
import { TitlePage } from "@/components/ui";
import AppointmentDetailsClient from "./AppointmentDetailsClient";

export const metadata = {
  title: "تفاصيل الموعد الطبي | مستشفى حضرموت الحديث",
  description: "تفاصيل وبطاقة الموعد الطبي في مستشفى حضرموت الحديث",
};

export default async function AppointmentDetailsPage({ params }) {
  const { id } = await params;
  const appointment = await appointmentsService.getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      {/* 1. App Navigation Header */}
      <AppHeader />

      {/* 2. Page Content */}
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 w-full space-y-4 sm:space-y-6">
        <TitlePage
          title="تفاصيل الموعد الطبي"
          backLink="/app/appointments"
          backLabel="العودة لسجل المواعيد"
        />
        <AppointmentDetailsClient initialAppointment={appointment} />
      </div>
    </main>
  );
}

import AppHeader from "@/components/layout/AppHeader";
import AppointmentsClient from "./AppointmentsClient";
import { TitlePage } from "@/components/ui";
import { appointmentsService } from "@/services/appointmentsService";

export const metadata = {
  title: "سجل المواعيد والحجوزات | مستشفى حضرموت الحديث",
  description: "استعرض سجل مواعيدك وحجوزاتك الطبية وتفاصيل بطاقات الكشف في مستشفى حضرموت الحديث.",
};

export default async function AppointmentsPage() {
  const appointments = await appointmentsService.getAppointments();

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      {/* 1. App Header Navigation */}
      <AppHeader />

      {/* 2. Main Page Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 lg:py-8 w-full space-y-4 sm:space-y-6">
        <TitlePage title="سجل المواعيد والحجوزات" />
        <AppointmentsClient initialAppointments={appointments} />
      </div>
    </main>
  );
}

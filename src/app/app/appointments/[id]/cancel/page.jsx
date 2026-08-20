import AppHeader from "@/components/layout/AppHeader";
import { appointmentsService } from "@/services/appointmentsService";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CancelAppointmentClient from "./CancelAppointmentClient";

export const metadata = {
  title: "إلغاء الموعد الطبي | مستشفى حضرموت الحديث",
  description: "صفحة تأكيد إلغاء الموعد الطبي",
};

export default async function CancelAppointmentPage({ params }) {
  const { id } = await params;
  const appointment = await appointmentsService.getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      <AppHeader />

      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 lg:py-8 w-full space-y-5">
        {/* Back Link */}
        <div>
          <Link
            href={`/app/appointments/${encodeURIComponent(appointment.appointment_id)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لبطاقة الموعد</span>
          </Link>
        </div>

        {/* Cancel Confirmation Client */}
        <CancelAppointmentClient appointment={appointment} />
      </div>
    </main>
  );
}

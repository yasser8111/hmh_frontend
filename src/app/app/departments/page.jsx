import Link from "next/link";
import { Building2, Stethoscope, ChevronLeft, CalendarPlus } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import { TitlePage, Card, Button } from "@/components/ui";
import { specialtiesService } from "@/services/specialtiesService";

export const metadata = {
  title: "الأقسام والعيادات | مستشفى حضرموت الحديث",
  description: "دليل الأقسام والعيادات الطبية التخصصية في مستشفى حضرموت الحديث",
};

export default async function DepartmentsPage() {
  const specialties = await specialtiesService.getSpecialties();

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col pb-12">
      <AppHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 w-full space-y-6 sm:space-y-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TitlePage
            title="الأقسام والعيادات التخصصية"
            backLink="/app"
            backLabel="الرئيسية"
          />

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              startIcon={<CalendarPlus className="w-4 h-4" />}
              link="/app/booking"
              className="w-full sm:w-auto"
            >
              حجز موعد
            </Button>
          </div>
        </div>

        {/* Specialties Grid */}
        {specialties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((specialty) => (
              <Card
                key={specialty.specialty_id}
                className="bg-white border-2 border-white hover:border-amber-300 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  {specialty.default_capacity && (
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                      السعة اليومية: {specialty.default_capacity}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-950 group-hover:text-amber-700 transition-colors">
                    {specialty.name_ar}
                  </h3>
                  {specialty.name_en && (
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                      {specialty.name_en}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/app/doctors?specialty_id=${encodeURIComponent(specialty.specialty_id)}`}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>أطباء القسم</span>
                  </Link>

                  <Link
                    href={`/app/booking?specialty_id=${encodeURIComponent(specialty.specialty_id)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-950 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 transition-colors"
                  >
                    <span>حجز بالقسم</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-2 border-white rounded-2xl p-12 text-center text-gray-400">
            لا توجد أقسام مسجلة حالياً.
          </Card>
        )}
      </div>
    </main>
  );
}

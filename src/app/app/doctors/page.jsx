import { Suspense } from "react";
import AppHeader from "@/components/layout/AppHeader";
import DoctorsClient from "./DoctorsClient";
import { Card } from "@/components/ui";
import { bookingService } from "@/services/bookingService";
import { doctorsService } from "@/services/doctorsService";

export const metadata = {
  title: "دليل الأطباء والاستشاريين | مستشفى حضرموت الحديث",
  description: "تعرف على نخبة الأطباء والاستشاريين في مستشفى حضرموت الحديث واحجز موعدك مباشرة",
};

const PAGE_SIZE = 12;

// Async data fetcher for the doctors section
async function DoctorsPageContainer({ page, specialtyId }) {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [specialties, doctorsResult] = await Promise.all([
    bookingService.getSpecialties(),
    doctorsService.getDoctorsPaginated({
      limit: PAGE_SIZE,
      offset,
      specialtyId: specialtyId === "all" ? undefined : specialtyId,
    }),
  ]);

  return (
    <DoctorsClient
      doctors={doctorsResult.data}
      total={doctorsResult.total}
      specialties={specialties}
      currentPage={currentPage}
      selectedSpecialtyId={specialtyId || "all"}
    />
  );
}

// Doctors grid loading skeleton
function DoctorsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header filter skeleton */}
      <Card className="bg-white border-2 border-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="w-48 h-5 bg-gray-100 rounded-lg"></div>
          <div className="w-full sm:w-72 h-10 bg-gray-100 rounded-2xl"></div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-8 bg-gray-100 rounded-2xl shrink-0"></div>
          ))}
        </div>
      </Card>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-white overflow-hidden space-y-3">
            <div className="w-full aspect-[4/3] bg-gray-100"></div>
            <div className="space-y-1.5 p-3.5 sm:p-4 pt-0">
              <div className="w-28 h-4 bg-gray-200 rounded-md"></div>
              <div className="w-20 h-3 bg-gray-100 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function DoctorsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page || "1";
  const specialtyId = resolvedSearchParams?.specialty_id || "all";

  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      {/* 1. Header Navigation */}
      <AppHeader />

      {/* 2. Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 lg:py-8 w-full">
        <Suspense key={`${page}-${specialtyId}`} fallback={<DoctorsSkeleton />}>
          <DoctorsPageContainer page={page} specialtyId={specialtyId} />
        </Suspense>
      </div>
    </main>
  );
}

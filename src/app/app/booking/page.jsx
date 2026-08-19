import { Suspense } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BookingWizard from "./BookingWizard";
import { Card } from "@/components/ui";
import { bookingService } from "@/services/bookingService";

export const metadata = {
  title: "حجز موعد طبي | مستشفى حضرموت الحديث",
  description: "احجز موعدك الطبي بسهولة مع نخبة من استشاريي وأطباء مستشفى حضرموت الحديث",
};

const MAX_DOCTORS_LIMIT = 100;

// Async data fetcher for the wizard section
async function BookingWizardContainer() {
  const [specialties, doctors] = await Promise.all([
    bookingService.getSpecialties(),
    bookingService.getDoctors(MAX_DOCTORS_LIMIT),
  ]);

  return <BookingWizard initialSpecialties={specialties} initialDoctors={doctors} />;
}

// Cards-only loading skeleton
function CardsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Steps bar skeleton */}
      <Card className="bg-white border-2 border-white p-4 sm:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100"></div>
              <div className="w-20 h-3 bg-gray-100 rounded-md"></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cards Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="w-44 h-5 bg-gray-200 rounded-lg"></div>
            <div className="w-64 h-3.5 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="w-64 h-9 bg-gray-100 rounded-xl hidden sm:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="bg-white border-2 border-white p-5 h-32 flex flex-col justify-between">
              <div className="w-11 h-11 bg-primary-50 rounded-2xl"></div>
              <div className="w-28 h-4 bg-gray-200 rounded-md"></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Server Component: Booking Page
export default function BookingPage() {
  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      {/* 1. Header component (Renders immediately) */}
      <AppHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 lg:py-8 w-full space-y-6">
        {/* 2. Hero & Header Section (Renders immediately) */}
        <section>
          <Card className="w-full flex flex-col justify-center">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-950 text-center">
                حجز موعد طبي جديد
              </h1>
            </div>
          </Card>
        </section>

        {/* 3. Cards Section*/}
        <section>
          <Suspense fallback={<CardsLoadingSkeleton />}>
            <BookingWizardContainer />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

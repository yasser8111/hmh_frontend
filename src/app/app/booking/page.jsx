import { Suspense } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BookingWizard, { StepTimeline, StepOneSkeleton } from "./BookingWizard";
import { Card, TitlePage } from "@/components/ui";
import { bookingService } from "@/services/bookingService";

export const metadata = {
  title: "حجز موعد طبي | مستشفى حضرموت الحديث",
  description: "احجز موعدك الطبي بسهولة مع نخبة من استشاريي وأطباء مستشفى حضرموت الحديث",
};

// Phase 1: Fetches only specialties (fast) — renders immediately
async function SpecialtiesContainer() {
  const specialties = await bookingService.getSpecialties();
  return <DoctorsContainer initialSpecialties={specialties} />;
}

// Phase 2: Fetches slim doctors list (names only) after specialties are done
async function DoctorsContainer({ initialSpecialties }) {
  const doctors = await bookingService.getDoctorsNames(100);
  return <BookingWizard initialSpecialties={initialSpecialties} initialDoctors={doctors} />;
}

// Skeleton: stepper + empty Step 1 cards while specialties load
function BookingStepOneLoadingFallback() {
  return (
    <div className="w-full space-y-6">
      <StepTimeline currentStep={1} />
      <StepOneSkeleton />
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="bg-primary-50/50 min-h-screen flex flex-col">
      <AppHeader />

      <div className="flex-1 max-w-7xl mx-auto px-0 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 lg:py-8 w-full space-y-4 sm:space-y-6">
        <TitlePage title="حجز موعد طبي جديد" />

        {/*
          Suspense streams specialties first, then doctors.
          The skeleton disappears as soon as specialties are ready —
          doctors stream in without blocking Step 1 UI.
        */}
        <section>
          <Suspense fallback={<BookingStepOneLoadingFallback />}>
            <SpecialtiesContainer />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

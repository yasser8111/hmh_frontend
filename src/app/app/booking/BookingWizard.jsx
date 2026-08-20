"use client";

import { useBookingWizard } from "@/hooks/useBookingWizard";
import { StepTimeline } from "./components/StepTimeline";
import { StepOne, StepOneSkeleton } from "./components/StepOne";
import { StepTwo } from "./components/StepTwo";
import { StepThree } from "./components/StepThree";
import { SuccessConfirmation } from "./components/SuccessConfirmation";
import { LoadingOverlay } from "./components/LoadingOverlay";

export { StepTimeline, StepOneSkeleton };

export default function BookingWizard({ initialSpecialties = [], initialDoctors = [] }) {
  const wizard = useBookingWizard({ initialSpecialties, initialDoctors });

  if (wizard.bookingResult) {
    return (
      <SuccessConfirmation result={wizard.bookingResult} onReset={wizard.resetBooking} />
    );
  }

  return (
    <div className="w-full space-y-6">
      <StepTimeline currentStep={wizard.currentStep} />

      {wizard.currentStep === 1 && <StepOne wizard={wizard} />}
      {wizard.currentStep === 2 && <StepTwo wizard={wizard} />}
      {wizard.currentStep === 3 && <StepThree wizard={wizard} />}

      {wizard.isSubmitting && <LoadingOverlay />}
    </div>
  );
}

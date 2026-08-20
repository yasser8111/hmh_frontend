"use client";

import { Button, Card, RadioCard } from "@/components/ui";

// Skeleton shown while doctors are loading
export function StepTwoSkeleton() {
  return (
    <div className="space-y-4 px-4 sm:px-0">
      <h3 className="text-lg font-bold text-gray-950">اختر الطبيب</h3>
      <div className="max-h-[55vh] sm:max-h-none overflow-y-auto sm:overflow-visible p-1 -m-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 border-gray-100 bg-white items-center h-14 ${
                i > 3 ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="h-4 bg-gray-200/80 rounded-md w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepTwo({ wizard }) {
  const {
    availableDoctors,
    selectedDoctor,
    setSelectedDoctor,
    prevStep,
    nextStep,
    canProceed,
  } = wizard;

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <h3 className="text-lg font-bold text-gray-950">اختر الطبيب</h3>

      {availableDoctors.length > 0 ? (
        <div className="max-h-[55vh] sm:max-h-none overflow-y-auto sm:overflow-visible p-1 -m-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {availableDoctors.map((doc) => (
              <RadioCard
                key={doc.doctor_id}
                layout="vertical"
                title={doc.full_name_ar}
                selected={selectedDoctor?.doctor_id === doc.doctor_id}
                onClick={() => setSelectedDoctor(doc)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-white border-2 border-white p-8 text-center">
          <p className="text-gray-500 text-sm">لا يوجد أطباء مسجلون في هذا القسم حالياً.</p>
        </Card>
      )}

      <div className="flex justify-between pt-3">
        <Button variant="muted" arrowIcon={false} onClick={prevStep} className="text-xs">
          السابق
        </Button>
        <Button
          variant="primary"
          disabled={!canProceed}
          onClick={nextStep}
          arrowIcon
          className="text-xs"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}

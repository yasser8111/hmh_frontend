"use client";

import { Search } from "lucide-react";
import { Button, Card, Input, RadioCard } from "@/components/ui";

// Skeleton shown while specialties are loading
export function StepOneSkeleton() {
  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-950">اختر القسم</h3>
        <div className="w-full sm:w-72">
          <div className="w-full h-11 bg-white border-2 border-gray-200 rounded-2xl px-4 flex items-center text-sm text-gray-400">
            ابحث عن قسم...
          </div>
        </div>
      </div>

      <div className="max-h-[55vh] sm:max-h-none overflow-y-auto sm:overflow-visible p-1 -m-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 border-gray-100 bg-white items-center h-14 ${
                i > 5 ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="h-4 bg-gray-200/80 rounded-md w-3/4" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-3">
        <Button variant="primary" disabled arrowIcon className="text-xs">
          التالي
        </Button>
      </div>
    </div>
  );
}

export function StepOne({ wizard }) {
  const {
    searchQuery,
    setSearchQuery,
    filteredSpecialties,
    selectedSpecialty,
    selectSpecialty,
    canProceed,
    nextStep,
  } = wizard;

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-950">اختر القسم</h3>
        <div className="w-full sm:w-72">
          <Input
            icon={Search}
            placeholder="ابحث عن قسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-[55vh] sm:max-h-none overflow-y-auto sm:overflow-visible p-1 -m-1">
        {filteredSpecialties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {filteredSpecialties.map((specialty) => (
              <RadioCard
                key={specialty.specialty_id}
                layout="vertical"
                title={specialty.name_ar}
                selected={selectedSpecialty?.specialty_id === specialty.specialty_id}
                onClick={() => selectSpecialty(specialty)}
              />
            ))}
          </div>
        ) : searchQuery.trim() !== "" ? (
          <Card className="bg-white border-2 border-white p-8 text-center">
            <p className="text-gray-500 text-sm">لا توجد أقسام مطابقة لبحثك.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border-2 border-gray-100 bg-white items-center h-14 ${
                  i > 5 ? "hidden sm:flex" : "flex"
                }`}
              >
                <div className="h-4 bg-gray-200/80 rounded-md w-3/4" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-3">
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

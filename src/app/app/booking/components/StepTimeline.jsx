"use client";

import { Check } from "lucide-react";

const STEPS = [
  { number: 1, title: "اختيار القسم" },
  { number: 2, title: "اختيار الطبيب" },
  { number: 3, title: "بيانات المريض" },
];

export function StepTimeline({ currentStep = 1 }) {
  return (
    <div className="py-2 sm:py-4 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto relative px-2 sm:px-6">
        {/* Track Line & Progress */}
        <div className="absolute top-4.5 sm:top-5 start-6 end-6 sm:start-11 sm:end-11 h-1 bg-gray-200 rounded-full z-0 overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          {STEPS.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            return (
              <div key={step.number} className="flex flex-col items-center gap-2 px-1 sm:px-3">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/25 ring-4 ring-primary-100 scale-105"
                      : isCompleted
                      ? "bg-emerald-500 text-white ring-4 ring-emerald-50 shadow-xs"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : step.number}
                </div>
                <span
                  className={`text-[11px] sm:text-xs text-center transition-colors ${
                    isActive
                      ? "font-bold text-primary-950"
                      : isCompleted
                      ? "font-semibold text-emerald-900"
                      : "font-medium text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

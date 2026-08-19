"use client";

import {
  User,
  CheckCircle2,
  Stethoscope,
  Search,
  Loader2,
  Phone,
  CreditCard,
  Building,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import { Button, Card, Input, RadioCard, Textarea } from "@/components/ui";
import { useBookingWizard } from "@/hooks/useBookingWizard";

const STEPS = [
  { number: 1, title: "اختيار القسم" },
  { number: 2, title: "اختيار الطبيب" },
  { number: 3, title: "بيانات المريض" },
];

// ----------------------------------------------------
// 1. TIMELINE STEPPER
// ----------------------------------------------------
function StepTimeline({ currentStep }) {
  return (
    <div className="py-2 sm:py-4">
      <div className="max-w-2xl mx-auto relative px-4 sm:px-6">
        {/* Track Line & Progress */}
        <div className="absolute top-4.5 sm:top-5 start-8 end-8 sm:start-11 sm:end-11 h-1 bg-gray-200 rounded-full z-0 overflow-hidden">
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
              <div
                key={step.number}
                className="flex flex-col items-center gap-2 px-2 sm:px-3"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/25 ring-4 ring-primary-100 scale-105"
                    : isCompleted
                      ? "bg-emerald-500 text-white ring-4 ring-emerald-50 shadow-xs"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                    }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : step.number}
                </div>
                <span
                  className={`text-[11px] sm:text-xs text-center transition-colors ${isActive
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

// ----------------------------------------------------
// 2. STEP 1: SPECIALTY SELECTION
// ----------------------------------------------------
function StepOne({ wizard }) {
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-950">اختر القسم</h3>
        </div>

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
      </div>

      <div className="flex justify-end pt-3">
        <Button
          variant="primary"
          disabled={!canProceed}
          onClick={nextStep}
          arrowIcon={true}
          className="text-xs"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. STEP 2: DOCTOR SELECTION
// ----------------------------------------------------
function StepTwo({ wizard }) {
  const {
    availableDoctors,
    selectedDoctor,
    setSelectedDoctor,
    prevStep,
    nextStep,
    canProceed,
  } = wizard;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-950">اختر الطبيب</h3>
      </div>

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
        <Button
          variant="muted"
          arrowIcon={false}
          onClick={prevStep}
          className="text-xs"
        >
          السابق
        </Button>
        <Button
          variant="primary"
          disabled={!canProceed}
          onClick={nextStep}
          arrowIcon={true}
          className="text-xs"
        >
          التالي
        </Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. STEP 3: PATIENT DETAILS, ATTENDANCE PERIOD & PAYMENT
// ----------------------------------------------------
function StepThree({ wizard }) {
  const {
    selectedSpecialty,
    selectedDoctor,
    patientName,
    setPatientName,
    patientAge,
    setPatientAge,
    whatsappPhone,
    setWhatsappPhone,
    preferredPeriod,
    setPreferredPeriod,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    isSubmitting,
    canProceed,
    prevStep,
    handleSubmitBooking,
  } = wizard;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-950">بيانات المريض وفترة الحضور</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Patient Fields */}
          <Card className="bg-white border-2 border-white p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">بيانات المريض</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="اسم المريض الرباعي *"
                  placeholder="أدخل الاسم الكامل للمريض..."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="العمر (بالسنوات)"
                  type="number"
                  placeholder="مثال: 32"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="رقم الواتساب *"
                  type="tel"
                  dir="ltr"
                  placeholder="+967 770 000 000"
                  icon={Phone}
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="font-mono text-start"
                />
              </div>
            </div>

            <div className="pt-2">
              <Textarea
                label="ملاحظات إضافية أو أعراض الزيارة (اختياري)"
                rows={2}
                placeholder="أدخل أي ملاحظات ترغب بإعلام الطبيب بها مسبقاً..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </Card>

          {/* 2. Attendance Period Card */}
          <Card className="bg-white border-2 border-white p-6 space-y-4">
            <div className="border-b border-gray-100 pb-2">
              <h4 className="text-sm font-bold text-gray-900">فترة الحضور *</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <RadioCard
                title="الفترة الصباحية"
                description="8:30 صباحاً - 1:30 ظهراً"
                icon={Sun}
                selected={preferredPeriod === "morning"}
                onClick={() => setPreferredPeriod("morning")}
              />

              <RadioCard
                title="الفترة المسائية"
                description="4:30 عصراً - 9:30 مساءً"
                icon={Moon}
                selected={preferredPeriod === "evening"}
                onClick={() => setPreferredPeriod("evening")}
              />
            </div>
          </Card>

          {/* 3. Payment Methods */}
          <Card className="bg-white border-2 border-white p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">طريقة الدفع</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RadioCard
                title="الدفع عند الحضور"
                description="الدفع نقداً أو بالشبكة في مكتب الاستقبال عند الوصول."
                icon={Building}
                selected={paymentMethod === "on_arrival"}
                onClick={() => setPaymentMethod("on_arrival")}
              />

              <RadioCard
                title="الدفع الإلكتروني"
                description="الدفع المسبق عبر البطاقات والمحافظ الإلكترونية."
                icon={CreditCard}
                disabled={true}
              />
            </div>
          </Card>
        </div>

        {/* Summary Column */}
        <div className="space-y-4">
          <Card className="bg-white border-2 border-white p-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">ملخص الحجز</h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">القسم:</span>
                <span className="font-semibold text-gray-900">{selectedSpecialty?.name_ar}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">الطبيب:</span>
                <span className="font-semibold text-gray-900">{selectedDoctor?.full_name_ar}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">فترة الحضور:</span>
                <span className="font-semibold text-gray-900">
                  {preferredPeriod === "morning" ? "صباحية (8:30 ص - 1:30 م)" : "مسائية (4:30 م - 9:30 م)"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">طريقة الدفع:</span>
                <span className="font-semibold text-gray-900">الدفع عند الحضور</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="p-3 rounded-2xl bg-amber-50 text-[11px] text-amber-900 space-y-1.5 leading-relaxed">
                <span className="font-bold block text-amber-950">ملاحظات:</span>
                <p>• يرجى التأكد من أن الرقم المُدخل مسجل في الواتساب لتصلك رسالة تأكيد الموعد ورقم الدور.</p>
                <p>• يرجى الحضور قبل الموعد بـ 15 دقيقة لتأكيد الدخول.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-3">
        <Button
          variant="muted"
          arrowIcon={false}
          disabled={isSubmitting}
          onClick={prevStep}
          className="text-xs"
        >
          السابق
        </Button>
        <Button
          variant="secondary"
          disabled={!canProceed}
          onClick={handleSubmitBooking}
          arrowIcon={!isSubmitting}
          className="text-xs"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحجز...</span>
            </span>
          ) : (
            "احجز"
          )}
        </Button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. SUCCESS CONFIRMATION SCREEN
// ----------------------------------------------------
function SuccessConfirmation({ result, onReset }) {
  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <Card className="bg-white p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-950">وصلنا حجزك</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            تم حجز موعدك بنجاح، وتم إرسال تفاصيل تأكيد الموعد ورقم الدور إلى رقم الواتساب: <span className="font-bold text-gray-900 font-mono">{result.whatsappPhone}</span>
          </p>
        </div>

        <div className="text-start space-y-3 pt-2">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">رقم الحجز</span>
            <span className="text-sm font-semibold text-gray-900 font-mono">{result.appointmentId}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">رقم الدور المتوقع</span>
            <span className="text-sm font-semibold text-gray-900 font-mono">#{result.appointmentNumber}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">اسم المريض</span>
            <span className="text-sm font-semibold text-gray-900">{result.patientName}</span>
          </div>
          {result.patientAge && (
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">العمر</span>
              <span className="text-sm font-semibold text-gray-900">{result.patientAge} سنة</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">رقم الواتساب</span>
            <span className="text-sm font-semibold text-gray-900 font-mono">{result.whatsappPhone}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">الطبيب</span>
            <span className="text-sm font-semibold text-gray-900">{result.doctor?.full_name_ar}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">القسم</span>
            <span className="text-sm font-semibold text-gray-900">{result.specialty?.name_ar || result.doctor?.specialty_name_ar}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">فترة الحضور</span>
            <span className="text-sm font-semibold text-gray-900">{result.period}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">طريقة الدفع</span>
            <span className="text-sm font-semibold text-gray-900">{result.paymentMethod}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-2"><Button
            variant="muted"
            arrowIcon={false}
            onClick={onReset}
            className="text-xs"
          >
            حجز موعد آخر
          </Button>
          <Button
            link="/app/appointments"
            variant="primary"
            arrowIcon={true}
            className="text-xs"
          >
            عرض مواعيدي
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// 6. LOADING OVERLAY
// ----------------------------------------------------
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="bg-white border-2 border-white p-6 rounded-3xl shadow-xl flex flex-col items-center gap-3 text-center max-w-xs animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h4 className="font-bold text-gray-900 text-sm">جاري تثبيت الحجز...</h4>
        <p className="text-xs text-gray-500">يرجى الانتظار لحظات لتأكيد الموعد وإصدار رقم الدور</p>
      </Card>
    </div>
  );
}

// ----------------------------------------------------
// MAIN WIZARD COMPONENT
// ----------------------------------------------------
export default function BookingWizard({
  initialSpecialties = [],
  initialDoctors = [],
}) {
  const wizard = useBookingWizard({ initialSpecialties, initialDoctors });

  if (wizard.bookingResult) {
    return (
      <SuccessConfirmation
        result={wizard.bookingResult}
        onReset={wizard.resetBooking}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stepper */}
      <StepTimeline currentStep={wizard.currentStep} />

      {/* Dynamic Steps */}
      {wizard.currentStep === 1 && <StepOne wizard={wizard} />}
      {wizard.currentStep === 2 && <StepTwo wizard={wizard} />}
      {wizard.currentStep === 3 && <StepThree wizard={wizard} />}

      {/* Submission Overlay */}
      {wizard.isSubmitting && <LoadingOverlay />}
    </div>
  );
}

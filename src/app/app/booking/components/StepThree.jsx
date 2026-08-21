"use client";

import { useState, useMemo, useEffect } from "react";
import { Phone, CreditCard, Building, Sun, Moon, Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Button, Card, Input, RadioCard, Textarea } from "@/components/ui";
import DatePicker from "@/components/ui/DatePicker";
import { doctorsService } from "@/services/doctorsService";
import { getAvailableBookingDays, formatArabicDate } from "../utils/bookingDateUtils";
import { getPeriodAvailabilityAndCrowd } from "../utils/scheduleUtils";

// Period card with crowd status badge
function PeriodCard({ title, time, icon: Icon, crowd, selected, disabled, isLocked, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between gap-3 select-none active:scale-[0.98] ${
        disabled
          ? "border-gray-200 bg-gray-50/50 opacity-60 cursor-not-allowed"
          : isLocked
          ? "border-gray-200 bg-gray-50/40 hover:border-gray-300 cursor-pointer"
          : selected
          ? "bg-primary-50/80 border-primary-500 cursor-pointer shadow-xs"
          : "bg-white border-gray-200 hover:border-primary-200 cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              disabled || isLocked
                ? "bg-gray-100 text-gray-400"
                : selected
                ? "bg-primary-500 text-white"
                : "bg-primary-50 text-primary-600"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h5 className={`text-xs font-bold ${disabled ? "text-gray-400" : "text-gray-950"}`}>
              {title}
            </h5>
            <p className="text-[11px] text-gray-500">{time}</p>
          </div>
        </div>
      </div>

      {crowd && (
        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium">حالة الازدحام:</span>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${crowd.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${crowd.dotClass}`} />
            <span>{crowd.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function StepThree({ wizard }) {
  const {
    selectedSpecialty,
    selectedDoctor,
    patientName,
    setPatientName,
    patientAge,
    setPatientAge,
    whatsappPhone,
    setWhatsappPhone,
    selectedDate,
    setSelectedDate,
    preferredPeriod,
    setPreferredPeriod,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    isSubmitting,
    bookingError,
    canProceed,
    prevStep,
    handleSubmitBooking,
  } = wizard;

  const [doctorSchedule, setDoctorSchedule] = useState(selectedDoctor?.schedule || []);
  const [showDateWarning, setShowDateWarning] = useState(false);

  // Fetch doctor schedule if not present in doctor object
  useEffect(() => {
    if (selectedDoctor?.schedule && selectedDoctor.schedule.length > 0) {
      setDoctorSchedule(selectedDoctor.schedule);
      return;
    }

    if (!selectedDoctor?.doctor_id) return;

    let isMounted = true;
    doctorsService.getDoctorSchedule(selectedDoctor.doctor_id)
      .then((data) => {
        if (isMounted && Array.isArray(data)) setDoctorSchedule(data);
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, [selectedDoctor]);

  const bookingDays = useMemo(() => getAvailableBookingDays(14), []);
  const selectedDayObj = bookingDays.find((d) => d.dateStr === selectedDate);

  const selectedDayKey = useMemo(() => {
    if (!selectedDate) return "";
    if (selectedDayObj) return selectedDayObj.dayKey;
    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateObj.getDay()] || "";
    } catch {
      return "";
    }
  }, [selectedDate, selectedDayObj]);

  const isCustomDate = useMemo(
    () => !!selectedDate && !bookingDays.some((d) => d.dateStr === selectedDate),
    [selectedDate, bookingDays]
  );

  const morningCrowd = useMemo(() => {
    if (!selectedDate || !selectedDayKey) return null;
    return getPeriodAvailabilityAndCrowd(doctorSchedule, selectedDoctor?.doctor_id, selectedDayKey, "morning", selectedDate);
  }, [doctorSchedule, selectedDoctor, selectedDayKey, selectedDate]);

  const eveningCrowd = useMemo(() => {
    if (!selectedDate || !selectedDayKey) return null;
    return getPeriodAvailabilityAndCrowd(doctorSchedule, selectedDoctor?.doctor_id, selectedDayKey, "evening", selectedDate);
  }, [doctorSchedule, selectedDoctor, selectedDayKey, selectedDate]);

  const todayDateStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const handlePeriodCardClick = (period) => {
    if (!selectedDate) {
      setShowDateWarning(true);
      return;
    }
    setShowDateWarning(false);
    const crowd = period === "morning" ? morningCrowd : eveningCrowd;
    if (crowd?.isAvailable) setPreferredPeriod(period);
  };

  return (
    <div className="space-y-5 px-4 sm:px-0">
      <h3 className="text-lg font-bold text-gray-950">بيانات المريض وفترة الحضور</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Patient Fields */}
          <Card className="bg-white border-2 border-white p-4 sm:p-6 space-y-4">
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

          {/* 2. Attendance Date & Period Card */}
          <Card className="bg-white border-2 border-white p-4 sm:p-6 space-y-6">
            <div className="border-b border-gray-100 pb-2 flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900">تحديد موعد وفترة الحضور *</h4>
            </div>

            {/* Day selection with horizontal swipe */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <span>1. اختر اليوم المناسب *</span>
                </label>
                <span className="text-[11px] text-gray-400">اسحب لعرض المزيد من الأيام</span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scroll-smooth select-none snap-x touch-pan-x">
                {bookingDays.map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.dateStr);
                        setShowDateWarning(false);
                        if (selectedDate !== day.dateStr) setPreferredPeriod("");
                      }}
                      className={`min-w-[82px] sm:min-w-[94px] p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 snap-start active:scale-95 ${
                        isSelected
                          ? "bg-primary-50/80 border-primary-500 shadow-xs"
                          : "bg-white border-gray-200 hover:border-primary-200"
                      }`}
                    >
                      <span className={`text-[11px] font-semibold ${isSelected ? "text-primary-700" : "text-gray-500"}`}>
                        {day.isToday ? "اليوم" : day.isTomorrow ? "غداً" : day.dayName}
                      </span>
                      <span className={`text-base font-bold font-mono ${isSelected ? "text-primary-950" : "text-gray-900"}`}>
                        {day.dayNumber}
                      </span>
                      <span className={`text-[10px] ${isSelected ? "text-primary-700" : "text-gray-400"}`}>
                        {day.monthName}
                      </span>
                    </button>
                  );
                })}

                {/* Custom Date Picker Button */}
                <div className="relative shrink-0 snap-start">
                  <input
                    type="date"
                    min={todayDateStr}
                    value={isCustomDate ? selectedDate : ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        setShowDateWarning(false);
                        setPreferredPeriod("");
                      }
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    aria-label="تحديد تاريخ مخصص"
                  />
                  <button
                    type="button"
                    className={`min-w-[86px] sm:min-w-[98px] h-full min-h-[82px] p-3 rounded-2xl border-2 border-dashed text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none active:scale-95 ${
                      isCustomDate
                        ? "bg-primary-50/80 border-primary-500 text-primary-700 shadow-xs"
                        : "bg-gray-50/60 border-gray-300 hover:border-primary-300 text-gray-600"
                    }`}
                  >
                    <Calendar className={`w-5 h-5 ${isCustomDate ? "text-primary-600" : "text-gray-500"}`} />
                    <span className="text-[11px] font-bold">{isCustomDate ? "تاريخ محدد" : "تاريخ آخر"}</span>
                    <span className="text-[10px] text-gray-400">
                      {isCustomDate ? formatArabicDate(selectedDate) : "اختر يوماً"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Period Selection */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>2. اختر فترة الحضور *</span>
                </label>
                {!selectedDate && (
                  <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">
                    يرجى تحديد اليوم أولاً
                  </span>
                )}
              </div>

              {showDateWarning && !selectedDate && (
                <div className="p-3 rounded-2xl bg-amber-50 text-xs font-semibold text-amber-900 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>يجب تحديد اليوم أولاً للتحقق من فترات دوام الطبيب ومستوى الازدحام.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PeriodCard
                  title="الفترة الصباحية"
                  time="8:30 صباحاً - 1:30 ظهراً"
                  icon={Sun}
                  crowd={selectedDate ? morningCrowd : null}
                  selected={preferredPeriod === "morning"}
                  disabled={selectedDate ? !morningCrowd?.isAvailable : false}
                  isLocked={!selectedDate}
                  onClick={() => handlePeriodCardClick("morning")}
                />
                <PeriodCard
                  title="الفترة المسائية"
                  time="4:30 عصراً - 9:30 مساءً"
                  icon={Moon}
                  crowd={selectedDate ? eveningCrowd : null}
                  selected={preferredPeriod === "evening"}
                  disabled={selectedDate ? !eveningCrowd?.isAvailable : false}
                  isLocked={!selectedDate}
                  onClick={() => handlePeriodCardClick("evening")}
                />
              </div>
            </div>
          </Card>

          {/* 3. Payment Methods */}
          <Card className="bg-white border-2 border-white p-4 sm:p-6 space-y-4">
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
                disabled
              />
            </div>
          </Card>
        </div>

        {/* Summary Column */}
        <div className="space-y-4">
          <Card className="bg-white border-2 border-white p-4 sm:p-6 space-y-4">
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
                <span className="text-gray-500">تاريخ الموعد:</span>
                <span className="font-semibold text-gray-900">
                  {selectedDate ? formatArabicDate(selectedDate) : "لم يتم التحديد"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">فترة الحضور:</span>
                <span className="font-semibold text-gray-900">
                  {preferredPeriod === "morning"
                    ? "صباحية (8:30 ص - 1:30 م)"
                    : preferredPeriod === "evening"
                    ? "مسائية (4:30 م - 9:30 م)"
                    : "لم يتم التحديد"}
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

            {bookingError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{bookingError}</span>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-3">
        <Button variant="muted" arrowIcon={false} disabled={isSubmitting} onClick={prevStep} className="text-xs">
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

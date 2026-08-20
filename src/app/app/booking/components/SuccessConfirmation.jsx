"use client";

import { CheckCircle2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { formatArabicDate } from "../utils/bookingDateUtils";

export function SuccessConfirmation({ result, onReset }) {
  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-0">
      <Card className="bg-white p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-950">وصلنا حجزك</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            تم حجز موعدك بنجاح، وتم إرسال تفاصيل تأكيد الموعد ورقم الدور إلى رقم الواتساب:{" "}
            <span className="font-bold text-gray-900 font-mono">{result.whatsappPhone}</span>
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
            <span className="text-sm font-semibold text-gray-900">
              {result.specialty?.name_ar || result.doctor?.specialty_name_ar}
            </span>
          </div>
          {result.date && (
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">تاريخ الموعد</span>
              <span className="text-sm font-semibold text-gray-900">{formatArabicDate(result.date)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-xs text-gray-500">فترة الحضور</span>
            <span className="text-sm font-semibold text-gray-900">{result.period}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">طريقة الدفع</span>
            <span className="text-sm font-semibold text-gray-900">{result.paymentMethod}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-between pt-2">
          <Button variant="outline" arrowIcon={false} onClick={onReset} className="text-xs">
            حجز موعد آخر
          </Button>
          <Button link="/app/appointments" variant="primary" arrowIcon className="text-xs">
            عرض مواعيدي
          </Button>
        </div>
      </Card>
    </div>
  );
}

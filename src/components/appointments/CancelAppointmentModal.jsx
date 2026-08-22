"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { appointmentsService } from "@/services/appointmentsService";
import { Button, RadioCard, Textarea, useToast } from "@/components/ui";

const CANCEL_REASONS = [
  { id: "urgent", title: "ظرف طارئ أو تغيير في المواعيد" },
  { id: "recovered", title: "تحسن الحالة الصحية والشفاء ولله الحمد" },
  { id: "other_booking", title: "الرغبة في حجز موعد مع طبيب أو تخصص آخر" },
  { id: "time_conflict", title: "صعوبة في الحضور في الوقت المحدد" },
  { id: "other", title: "أسباب أخرى (يرجى التوضيح أدناه)" },
];

export default function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) {
  const toast = useToast();
  const [selectedReasonId, setSelectedReasonId] = useState(CANCEL_REASONS[0].id);
  const [customNotes, setCustomNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      const res = await appointmentsService.cancelAppointment(appointment.appointment_id);
      if (res.success) {
        toast.success("تم إلغاء الموعد بنجاح", "تم تحديث حالة الحجز إلى ملغي في سجلك الطبي");
        if (onSuccess) {
          onSuccess(appointment.appointment_id);
        }
        onClose();
      } else {
        toast.error("تعذر إلغاء الموعد", res.message || "حدث خطأ أثناء الاتصال بالخادم");
      }
    } catch {
      toast.error("فشل إلغاء الموعد", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-5 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto text-right">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cancel-modal-title" className="text-base sm:text-lg font-bold text-gray-950">
                إلغاء الموعد الطبي
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                رقم الحجز: <span className="font-mono">{appointment.appointment_id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Appointment Brief Banner */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">الطبيب المعالج:</span>
            <span className="font-bold text-gray-900">
              {appointment.doctor_name_ar || appointment.doctor_name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">تاريخ الموعد:</span>
            <span className="font-semibold text-gray-900">
              {appointment.appointment_date} (
              {appointment.period === "morning"
                ? "الصباح"
                : appointment.period === "evening"
                  ? "المساء"
                  : appointment.period}
              )
            </span>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-900 block">
            يرجى تحديد سبب الإلغاء:
          </label>
          <div className="space-y-2">
            {CANCEL_REASONS.map((item) => (
              <RadioCard
                key={item.id}
                title={item.title}
                variant="danger"
                selected={selectedReasonId === item.id}
                onClick={() => setSelectedReasonId(item.id)}
                className="py-2.5 px-3.5 rounded-xl border text-xs"
              />
            ))}
          </div>
        </div>

        {/* Custom Notes */}
        <Textarea
          label="ملاحظات إضافية (اختياري)"
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="أدخل أي تفاصيل ترغب بإبلاغنا بها..."
          rows={2}
          className="text-xs"
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="muted"
            arrowIcon={false}
            disabled={isProcessing}
            onClick={onClose}
            className="text-xs"
          >
            تراجع والإبقاء
          </Button>

          <Button
            type="button"
            variant="danger"
            arrowIcon={false}
            disabled={isProcessing}
            onClick={handleConfirmCancel}
            className="text-xs font-bold"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الإلغاء...</span>
              </span>
            ) : (
              "تأكيد إلغاء الموعد"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CancelAppointmentModal };

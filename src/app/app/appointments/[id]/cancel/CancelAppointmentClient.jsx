"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { appointmentsService } from "@/services/appointmentsService";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import RadioCard from "@/components/ui/RadioCard";

import { useToast } from "@/components/ui/Toast";

const CANCEL_REASONS = [
  { id: "urgent", title: "ظرف طارئ أو تغيير في المواعيد" },
  { id: "recovered", title: "تحسن الحالة الصحية والشفاء ولله الحمد" },
  { id: "other_booking", title: "الرغبة في حجز موعد مع طبيب أو تخصص آخر" },
  { id: "time_conflict", title: "صعوبة في الحضور في الوقت المحدد" },
  { id: "other", title: "أسباب أخرى (يرجى التوضيح أدناه)" },
];

export default function CancelAppointmentClient({ appointment }) {
  const router = useRouter();
  const toast = useToast();
  const [selectedReasonId, setSelectedReasonId] = useState(CANCEL_REASONS[0].id);
  const [customNotes, setCustomNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      const res = await appointmentsService.cancelAppointment(appointment.appointment_id);
      if (res.success) {
        toast.success("تم إلغاء الموعد بنجاح", "تم تحديث حالة الحجز في سجلك الطبي");
        setIsDone(true);
        setTimeout(() => {
          router.push("/app/appointments");
          router.refresh();
        }, 1200);
      } else {
        toast.error("تعذر إلغاء الموعد", res.message || "حدث خطأ أثناء الاتصال بالخادم");
      }
    } catch {
      toast.error("فشل إلغاء الموعد", "يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isDone) {
    return (
      <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-950">تم إلغاء الموعد بنجاح</h2>
          <p className="text-xs text-gray-500">جاري توجيهك إلى سجل المواعيد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl mx-auto space-y-6">
      {/* Header Warning */}
      <div className="text-center space-y-2 pb-1">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-100">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-950">إلغاء الموعد الطبي</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          يرجى تحديد سبب الإلغاء لمساعدتنا في تحسين خدماتنا.
        </p>
      </div>

      {/* Reason Selection Cards (Stacked Vertically with Danger Variant RadioCard) */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-900 block">
          ما هو سبب إلغاء الموعد؟
        </label>
        <div className="space-y-2">
          {CANCEL_REASONS.map((item) => (
            <RadioCard
              key={item.id}
              title={item.title}
              variant="danger"
              selected={selectedReasonId === item.id}
              onClick={() => setSelectedReasonId(item.id)}
              className="py-3 px-4 rounded-2xl border"
            />
          ))}
        </div>
      </div>

      {/* Additional Notes using Textarea component */}
      <Textarea
        label="ملاحظات أو تفاصيل إضافية (اختياري)"
        value={customNotes}
        onChange={(e) => setCustomNotes(e.target.value)}
        placeholder="أدخل أي ملاحظات ترغب في مشاركتها..."
        rows={3}
        className="text-xs sm:text-sm focus:border-rose-400"
      />

      {/* Action Buttons: Right button is Primary (تراجع), Left button uses danger variant */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Right Button (Primary - Go back / keep appointment) */}
        <Button
          link={`/app/appointments/${encodeURIComponent(appointment.appointment_id)}`}
          variant="primary"
          arrowIcon={false}
          className="flex-1 sm:flex-none text-xs sm:text-sm"
        >
          تراجع
        </Button>

        {/* Left Button (Danger Variant) */}
        <Button
          type="button"
          disabled={isProcessing}
          onClick={handleConfirmCancel}
          variant="danger-muted"
          arrowIcon={false}
          className="flex-1 sm:flex-none text-xs sm:text-sm border border-rose-200"
        >
          {isProcessing ? "جاري إلغاء الموعد..." : "تأكيد إلغاء الموعد"}
        </Button>
      </div>
    </div>
  );
}

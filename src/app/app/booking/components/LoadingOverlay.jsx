"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui";

export function LoadingOverlay() {
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

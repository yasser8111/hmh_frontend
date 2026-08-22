"use client";

import { CalendarX2 } from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function EmptyAppointments({
  searchQuery = "",
  onClearSearch,
  title,
  description,
  className = "",
}) {
  const isSearchActive = Boolean(searchQuery && searchQuery.trim());

  const defaultTitle = isSearchActive
    ? "لا توجد نتائج مطابقة"
    : "لا توجد مواعيد مسجلة";

  const defaultDescription = isSearchActive
    ? "لم يتم العثور على أي موعد يطابق معايير البحث المدخلة."
    : "ليس لديك أي مواعيد في هذا التصنيف حالياً.";

  return (
    <Card
      className={`bg-white border-2 border-white p-8 sm:p-12 text-center space-y-4 ${className}`}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gray-50 text-gray-400 mx-auto flex items-center justify-center">
        <CalendarX2 className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-base sm:text-lg font-bold text-gray-950">
          {title || defaultTitle}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {description || defaultDescription}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        {isSearchActive ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all cursor-pointer select-none active:scale-95"
          >
            مسح البحث
          </button>
        ) : (
          <Button
            link="/app/booking"
            variant="primary"
            arrowIcon={false}
            className="text-xs px-5 py-2.5"
          >
            احجز موعدك الآن
          </Button>
        )}
      </div>
    </Card>
  );
}

export { EmptyAppointments };

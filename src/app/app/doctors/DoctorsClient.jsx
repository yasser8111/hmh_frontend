"use client";

import Link from "next/link";
import { User, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, SearchBar } from "@/components/ui";
import { useDoctors } from "@/hooks/useDoctors";

export default function DoctorsClient({
  doctors = [],
  total = 0,
  specialties = [],
  currentPage = 1,
  selectedSpecialtyId = "all",
}) {
  const {
    searchQuery,
    setSearchQuery,
    filteredDoctors,
    totalPages,
    getPageNumbers,
    handleSpecialtyChange,
    handlePageChange,
  } = useDoctors({
    doctors,
    total,
    currentPage,
    selectedSpecialtyId,
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters Section */}
      <Card className="bg-white border-2 border-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-950">
              أطباء واستشاريو المستشفى
            </h1>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <SearchBar
              placeholder="ابحث باسم الطبيب أو القسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="md"
            />
          </div>
        </div>

        {/* Specialty Filter Tabs */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSpecialtyChange("all")}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer select-none active:scale-[0.98] ${
                selectedSpecialtyId === "all"
                  ? "bg-primary-500 text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              جميع الأقسام
            </button>

            {specialties.map((spec) => {
              const isSelected = selectedSpecialtyId === spec.specialty_id;

              return (
                <button
                  key={spec.specialty_id}
                  type="button"
                  onClick={() => handleSpecialtyChange(spec.specialty_id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? "bg-primary-500 text-white shadow-xs"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {spec.name_ar}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 2. Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredDoctors.map((doctor) => {
              const specialtyName =
                doctor.specialty_name_ar || doctor.specialty?.name_ar || "عيادة متخصصة";

              return (
                <Link
                  key={doctor.doctor_id}
                  href={`/app/doctors/${doctor.doctor_id}`}
                  className="bg-white rounded-2xl border-2 border-white overflow-hidden flex flex-col justify-between hover:border-primary-200 transition-all cursor-pointer group shadow-xs touch-manipulation select-none active:scale-[0.98]"
                >
                  {/* Top Edge-to-Edge Image */}
                  <div className="w-full aspect-[4/3] bg-primary-50/60 overflow-hidden relative flex items-center justify-center">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.full_name_ar}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-400 bg-primary-50/50 group-hover:text-primary-500 transition-colors">
                        <User className="w-14 h-14 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Content: Doctor Name & Specialty */}
                  <div className="p-3.5 sm:p-4 space-y-0.5">
                    <h3 className="font-bold text-gray-950 text-sm truncate group-hover:text-primary-600 transition-colors">
                      {doctor.full_name_ar}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {specialtyName}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 3. Square Numbered Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4">
              {/* Previous Arrow Button */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="الصفحة السابقة"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center transition-all ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed text-gray-300"
                    : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-95 shadow-2xs"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Number Buttons */}
              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-6 sm:w-8 h-9 sm:h-10 flex items-center justify-center text-xs text-gray-400 font-bold select-none"
                    >
                      ...
                    </span>
                  );
                }

                const isActive = currentPage === page;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                      isActive
                        ? "bg-primary-500 text-white border border-primary-500 shadow-xs font-bold"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-2xs"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Arrow Button */}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="الصفحة التالية"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center transition-all ${
                  currentPage >= totalPages
                    ? "opacity-40 cursor-not-allowed text-gray-300"
                    : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-95 shadow-2xs"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <Card className="bg-white border-2 border-white p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 mx-auto flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              لا توجد نتائج مطابقة
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              لم نتمكن من العثور على أطباء يطابقون بحثك. يرجى تجربة كلمات أخرى أو إعادة ضبط التصفية.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSpecialtyChange("all")}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer"
            >
              إعادة ضبط البحث
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

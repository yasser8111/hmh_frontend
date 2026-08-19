"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export function useDoctors({
  doctors = [],
  total = 0,
  currentPage = 1,
  selectedSpecialtyId = "all",
  pageSize = 12,
} = {}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Handle specialty filter change and reset page
  const handleSpecialtyChange = (specId) => {
    setSearchQuery("");
    const url =
      specId === "all"
        ? "/app/doctors?page=1"
        : `/app/doctors?specialty_id=${encodeURIComponent(specId)}&page=1`;
    router.push(url);
  };

  // Handle page change and preserve specialty filter
  const handlePageChange = (pageNumber) => {
    const specParam =
      selectedSpecialtyId !== "all"
        ? `&specialty_id=${encodeURIComponent(selectedSpecialtyId)}`
        : "";
    router.push(`/app/doctors?page=${pageNumber}${specParam}`);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter doctors by search query on the active dataset
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors;

    const q = searchQuery.trim().toLowerCase();
    return doctors.filter((doc) => {
      const nameAr = (doc.full_name_ar || "").toLowerCase();
      const nameEn = (doc.full_name_en || "").toLowerCase();
      const specAr = (doc.specialty_name_ar || "").toLowerCase();
      const specEn = (doc.specialty_name_en || "").toLowerCase();

      return (
        nameAr.includes(q) ||
        nameEn.includes(q) ||
        specAr.includes(q) ||
        specEn.includes(q)
      );
    });
  }, [doctors, searchQuery]);

  // Total pages calculation based on total count
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Generate pagination page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredDoctors,
    totalPages,
    getPageNumbers,
    handleSpecialtyChange,
    handlePageChange,
  };
}

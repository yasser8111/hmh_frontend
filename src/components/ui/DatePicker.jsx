"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const ARABIC_WEEKDAYS = [
  "السبت",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

function parseDateStr(str) {
  if (!str) return null;
  const parts = String(str).split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return { year: y, month: m, day: d };
    }
  }
  return null;
}

function formatDateStr(year, month, day) {
  const y = String(year).padStart(4, "0");
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({
  label,
  value = "",
  onChange,
  min,
  max,
  placeholder = "اختر التاريخ...",
  error,
  helperText,
  disabled = false,
  className = "",
  containerClassName = "",
  id,
  name,
  required = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("days"); // "days" | "months" | "years"

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 330,
    placement: "bottom",
  });

  const parsedValue = useMemo(() => parseDateStr(value), [value]);
  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }, []);

  const [currentYear, setCurrentYear] = useState(
    parsedValue?.year || today.year
  );
  const [currentMonth, setCurrentMonth] = useState(
    parsedValue?.month !== undefined ? parsedValue.month : today.month
  );

  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync internal view year/month when value changes externally
  useEffect(() => {
    if (parsedValue) {
      setCurrentYear(parsedValue.year);
      setCurrentMonth(parsedValue.month);
    }
  }, [parsedValue]);

  const minDate = useMemo(() => parseDateStr(min), [min]);
  const maxDate = useMemo(() => parseDateStr(max), [max]);

  const isDateDisabled = useCallback((year, month, day) => {
    const cur = new Date(year, month, day).getTime();
    if (minDate) {
      const minTime = new Date(minDate.year, minDate.month, minDate.day).getTime();
      if (cur < minTime) return true;
    }
    if (maxDate) {
      const maxTime = new Date(maxDate.year, maxDate.month, maxDate.day).getTime();
      if (cur > maxTime) return true;
    }
    return false;
  }, [minDate, maxDate]);

  // Pixel-perfect anchor and viewport boundary calculation
  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const popupWidth = Math.min(340, window.innerWidth - 24);
    const popupHeight = 340;
    const gap = 8;
    const margin = 12;

    // Vertical positioning (auto-flip if close to viewport bottom)
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    let top = rect.bottom + gap;
    let placement = "bottom";

    if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
      top = Math.max(margin, rect.top - popupHeight - gap);
      placement = "top";
    }

    // Horizontal positioning (RTL: align with right edge of input, clamp to viewport)
    let left = rect.right - popupWidth;

    if (left < margin) {
      left = margin;
    }
    if (left + popupWidth > window.innerWidth - margin) {
      left = window.innerWidth - popupWidth - margin;
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      width: popupWidth,
      placement,
    });
  }, []);

  // Recalculate on open, scroll, or resize
  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfWeek = useMemo(() => {
    const day = new Date(currentYear, currentMonth, 1).getDay();
    return (day + 1) % 7;
  }, [currentYear, currentMonth]);

  const handleSelectDay = (day) => {
    if (isDateDisabled(currentYear, currentMonth, day)) return;
    const formatted = formatDateStr(currentYear, currentMonth, day);
    if (onChange) {
      onChange({ target: { name, value: formatted } });
    }
    setIsOpen(false);
    setViewMode("days");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { name, value: "" } });
    }
  };

  const handleInputClick = () => {
    if (disabled) return;
    updatePosition();

    // Auto-select today if no date is set and today is selectable
    if (!value && !isDateDisabled(today.year, today.month, today.day)) {
      const formatted = formatDateStr(today.year, today.month, today.day);
      if (onChange) {
        onChange({ target: { name, value: formatted } });
      }
      setCurrentYear(today.year);
      setCurrentMonth(today.month);
    }

    setIsOpen((prev) => !prev);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const minYearLimit = minDate?.year || 1920;
  const maxYearLimit = maxDate?.year || today.year + 20;

  const yearsList = useMemo(() => {
    const list = [];
    for (let y = maxYearLimit; y >= minYearLimit; y--) {
      list.push(y);
    }
    return list;
  }, [minYearLimit, maxYearLimit]);

  const displayString = useMemo(() => {
    if (!parsedValue) return "";
    return `${parsedValue.day} ${ARABIC_MONTHS[parsedValue.month]} ${parsedValue.year}`;
  }, [parsedValue]);

  const baseInputStyles =
    "w-full px-4 py-4 lg:py-2.5 rounded-2xl border-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-between";

  const borderStyles = error
    ? "border-red-500 focus:border-red-500 ring-red-500/20"
    : "border-gray-200 hover:border-gray-300 focus:border-primary";

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col gap-1 w-full ${containerClassName}`}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700 select-none flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </span>
        </label>
      )}

      {/* Input Display Button */}
      <div
        id={inputId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleInputClick}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleInputClick();
          }
        }}
        className={`${baseInputStyles} ${borderStyles} ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : ""
          } ${className}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="size-5 text-gray-400 shrink-0" />
          <span className={displayString ? "text-gray-900 font-medium" : "text-gray-400"}>
            {displayString || placeholder}
          </span>
        </div>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            title="مسح التاريخ"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Helper / Error Text */}
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}

      {/* Floating Calendar via React Portal */}
      {isOpen && mounted && createPortal(
        <>
          {/* Backdrop click interceptor */}
          <div
            className="fixed inset-0 z-9998 bg-transparent"
            onClick={() => {
              setIsOpen(false);
              setViewMode("days");
            }}
          />

          {/* Popup Calendar Card */}
          <div
            ref={popupRef}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            className="fixed z-9999 bg-white rounded-3xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <div className="flex items-center gap-1.5">
                {/* Year Selector Button */}
                <button
                  type="button"
                  onClick={() =>
                    setViewMode((prev) => (prev === "years" ? "days" : "years"))
                  }
                  className="px-2.5 py-1 text-xs font-bold text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  {currentYear}
                </button>

                {/* Month Selector Button */}
                <button
                  type="button"
                  onClick={() =>
                    setViewMode((prev) => (prev === "months" ? "days" : "months"))
                  }
                  className="px-2.5 py-1 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors cursor-pointer"
                >
                  {ARABIC_MONTHS[currentMonth]}
                </button>
              </div>

              {/* Prev/Next Month Arrows + Close (X) Button */}
              <div className="flex items-center gap-1">
                {viewMode === "days" && (
                  <>
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                      title="الشهر السابق"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                      title="الشهر التالي"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  </>
                )}

                {/* Top Close (X) Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setViewMode("days");
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer mr-0.5"
                  title="إغلاق"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* 1. DAYS VIEW */}
            {viewMode === "days" && (
              <>
                {/* Full Weekday Labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {ARABIC_WEEKDAYS.map((wd) => (
                    <span
                      key={wd}
                      className="text-[10px] sm:text-[11px] font-bold text-gray-500 py-1 truncate"
                      title={wd}
                    >
                      {wd}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty slots for week alignment */}
                  {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                    <span key={`empty-${idx}`} className="h-8 sm:h-9" />
                  ))}

                  {/* Actual Days */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const isSelected =
                      parsedValue?.year === currentYear &&
                      parsedValue?.month === currentMonth &&
                      parsedValue?.day === day;
                    const isToday =
                      today.year === currentYear &&
                      today.month === currentMonth &&
                      today.day === day;
                    const disabledDay = isDateDisabled(
                      currentYear,
                      currentMonth,
                      day
                    );

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={disabledDay}
                        onClick={() => handleSelectDay(day)}
                        className={`h-8 sm:h-9 text-xs rounded-xl flex items-center justify-center font-medium transition-all duration-100 select-none cursor-pointer ${disabledDay
                            ? "text-gray-300 cursor-not-allowed"
                            : isSelected
                              ? "bg-primary-500 text-white font-bold shadow-xs scale-105"
                              : isToday
                                ? "border-2 border-primary-400 text-primary-600 font-bold hover:bg-primary-50"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* 2. MONTHS VIEW */}
            {viewMode === "months" && (
              <div className="grid grid-cols-3 gap-2 py-2">
                {ARABIC_MONTHS.map((mName, idx) => {
                  const isSelected = currentMonth === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => {
                        setCurrentMonth(idx);
                        setViewMode("days");
                      }}
                      className={`py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer ${isSelected
                          ? "bg-primary-500 text-white font-bold"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. YEARS VIEW */}
            {viewMode === "years" && (
              <div className="max-h-52 overflow-y-auto grid grid-cols-3 gap-2 py-2 pr-1">
                {yearsList.map((y) => {
                  const isSelected = currentYear === y;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setCurrentYear(y);
                        setViewMode("months");
                      }}
                      className={`py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer ${isSelected
                          ? "bg-primary-500 text-white font-bold"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconContainerClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    barClass: "bg-emerald-500",
    borderClass: "border-emerald-200/80",
    titleClass: "text-emerald-950",
  },
  error: {
    icon: AlertCircle,
    iconContainerClass: "bg-rose-50 text-rose-600 border-rose-100",
    barClass: "bg-rose-500",
    borderClass: "border-rose-200/80",
    titleClass: "text-rose-950",
  },
  warning: {
    icon: AlertTriangle,
    iconContainerClass: "bg-amber-50 text-amber-600 border-amber-100",
    barClass: "bg-amber-500",
    borderClass: "border-amber-200/80",
    titleClass: "text-amber-950",
  },
  info: {
    icon: Info,
    iconContainerClass: "bg-primary-50 text-primary-600 border-primary-100",
    barClass: "bg-primary-500",
    borderClass: "border-primary-200/80",
    titleClass: "text-primary-950",
  },
};

const SWIPE_THRESHOLD = 70;

function ToastItem({ toast, onDismiss }) {
  const { id, type = "info", title, message, duration = 4000 } = toast;
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef(null);

  // Auto-dismiss countdown
  useEffect(() => {
    if (duration <= 0) return;

    const interval = 50;
    timerRef.current = setInterval(() => {
      if (!isPaused && !isDragging) {
        remainingTimeRef.current -= interval;
        const percent = Math.max(0, (remainingTimeRef.current / duration) * 100);
        setProgress(percent);

        if (remainingTimeRef.current <= 0) {
          clearInterval(timerRef.current);
          setIsExiting(true);
          setTimeout(() => onDismiss(id), 250);
        }
      }
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [duration, id, isPaused, isDragging, onDismiss]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 250);
  };

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentXRef.current = e.touches[0].clientX;
    const deltaX = currentXRef.current - startXRef.current;
    setDragX(deltaX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPaused(false);

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      // Swiped past threshold: animate out in swipe direction
      const exitTarget = dragX > 0 ? 400 : -400;
      setDragX(exitTarget);
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 200);
    } else {
      // Snap back
      setDragX(0);
    }
  };

  // Pointer / Mouse Drag Handlers (Desktop & Stylus)
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setIsPaused(true);
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    currentXRef.current = e.clientX;
    const deltaX = currentXRef.current - startXRef.current;
    setDragX(deltaX);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      const exitTarget = dragX > 0 ? 400 : -400;
      setDragX(exitTarget);
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 200);
    } else {
      setDragX(0);
    }
  };

  const currentOpacity = isExiting
    ? 0
    : isDragging
    ? Math.max(0.2, 1 - Math.abs(dragX) / 250)
    : 1;

  const currentTransform = isExiting
    ? `translateX(${dragX || 0}px) translateY(-10px) scale(0.95)`
    : `translateX(${dragX}px)`;

  return (
    <div
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => !isDragging && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: currentTransform,
        opacity: currentOpacity,
        transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
        touchAction: "pan-y",
        userSelect: "none",
      }}
      className={`pointer-events-auto w-full bg-white border ${config.borderClass} rounded-2xl shadow-lg p-3.5 sm:p-4 flex items-start gap-3 relative overflow-hidden cursor-grab active:cursor-grabbing select-none`}
    >
      {/* Semantic Icon */}
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.iconContainerClass}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5 pt-0.5 text-right pointer-events-none">
        {title && (
          <h4 className={`text-xs sm:text-sm font-bold truncate ${config.titleClass}`}>
            {title}
          </h4>
        )}
        {message && (
          <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="إغلاق التنبيه"
        className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors -mr-1 -mt-1 active:scale-90 pointer-events-auto"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      {duration > 0 && !isDragging && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-100">
          <div
            className={`h-full transition-all duration-75 ${config.barClass}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-label="التنبيهات والإشعارات"
      className="fixed z-50 pointer-events-none flex flex-col gap-2.5 
                 w-full top-3 inset-x-0 px-3.5 
                 sm:top-5 sm:left-5 sm:right-auto sm:inset-x-auto sm:px-0 sm:max-w-md"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

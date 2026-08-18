"use client";

import { useRef, useState, useEffect } from "react";

export default function InputOTP({
  length = 6,
  value = "",
  onChange,
  onComplete,
  label,
  error,
  helperText,
  disabled = false,
  className = "",
  ...props
}) {
  const [otp, setOtp] = useState(() => {
    const arr = Array(length).fill("");
    for (let i = 0; i < Math.min(value.length, length); i++) {
      arr[i] = value[i];
    }
    return arr;
  });

  const inputRefs = useRef([]);

  useEffect(() => {
    if (value !== undefined) {
      const arr = Array(length).fill("");
      for (let i = 0; i < Math.min(value.length, length); i++) {
        arr[i] = value[i];
      }
      setOtp(arr);
    }
  }, [value, length]);

  const updateOtp = (newOtp) => {
    setOtp(newOtp);
    const full = newOtp.join("");
    if (onChange) onChange(full);
    if (full.length === length && onComplete) {
      onComplete(full);
    }
  };

  const handleChange = (e, index) => {
    const val = e.target.value.slice(-1);
    if (!val && e.target.value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = val;
    updateOtp(newOtp);

    // Auto focus next slot
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        updateOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        updateOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim().slice(0, length);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    updateOtp(newOtp);
    const nextIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIdx]?.focus();
  };

  // Border & Focus styles based on error state
  const borderStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
    : "border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary/15";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} {...props}>
      {/* Label */}
      {label && (
        <label className={`text-sm font-medium select-none ${error ? "text-red-500" : "text-gray-700"}`}>
          {label}
        </label>
      )}

      {/* Slots Container with Shake Animation on Error */}
      <div
        dir="ltr"
        className={`flex items-center gap-2 sm:gap-3 ${error ? "animate-shake" : ""}`}
        onPaste={handlePaste}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`size-12 sm:size-14 text-center text-lg sm:text-xl font-bold rounded-2xl border-2 bg-white text-gray-900 transition-all duration-200 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 ${borderStyles}`}
          />
        ))}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <span className="text-xs text-gray-500 mt-0.5">{helperText}</span>
      )}
    </div>
  );
}

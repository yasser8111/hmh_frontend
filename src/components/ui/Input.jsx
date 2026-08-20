"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  error,
  helperText,
  icon: Icon,
  className = "",
  containerClassName = "",
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  // Style Variants
  const baseInputStyles = "w-full px-4 py-2.5 rounded-2xl border-2  text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

  const borderStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary/20";

  const paddingStyles = `${Icon ? "pr-11" : ""} ${isPassword ? "pl-11" : ""}`;

  return (
    <div className={`flex flex-col gap-1 w-full ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 select-none">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute right-3.5 text-gray-400 pointer-events-none flex items-center">
            <Icon className="size-5" />
          </div>
        )}

        <input
          id={inputId}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={props.value !== undefined ? props.value : ""}
          className={`${baseInputStyles} ${borderStyles} ${paddingStyles} ${className}`}
          {...props}
        />

        {/* Password Eye Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-3.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1 cursor-pointer hover:bg-gray-200 rounded-full active:scale-95"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>

      {/* Error / Helper Message */}
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}
    </div>
  );
}

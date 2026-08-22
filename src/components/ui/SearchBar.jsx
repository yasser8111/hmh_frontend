"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value = "",
  onChange,
  onClear,
  placeholder = "بحث...",
  className = "",
  containerClassName = "",
  size = "md",
  disabled = false,
  autoFocus = false,
  id,
  ...props
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: "" } });
    }
    inputRef.current?.focus();
  };

  // Size variants
  const sizeStyles = {
    sm: "py-2 pr-9 pl-8 text-xs",
    md: "py-2.5 pr-10 pl-8 text-xs sm:text-sm",
    lg: "py-3 pr-11 pl-9 text-sm",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5 right-3",
    md: "w-4 h-4 right-3.5",
    lg: "w-4.5 h-4.5 right-4",
  };

  const clearButtonSizes = {
    sm: "left-2 p-0.5",
    md: "left-2.5 p-1",
    lg: "left-3 p-1",
  };

  return (
    <div className={`relative flex items-center w-full lg:w-100 ${containerClassName}`}>
      {/* Search Icon */}
      <Search
        className={`text-gray-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
          iconSizes[size] || iconSizes.md
        }`}
      />

      {/* Input Field */}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full bg-white border-2 border-white hover:border-gray-200 focus:border-primary-500 rounded-xl sm:rounded-2xl text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 ${
          sizeStyles[size] || sizeStyles.md
        } ${className}`}
        {...props}
      />

      {/* Clear Button */}
      {Boolean(value) && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="مسح نص البحث"
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-all cursor-pointer active:scale-90 ${
            clearButtonSizes[size] || clearButtonSizes.md
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export { SearchBar };

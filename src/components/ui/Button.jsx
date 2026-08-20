"use client";

import { ArrowUpLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const variantStyles = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white border-transparent",
  secondary: "bg-secondary-500 hover:bg-secondary-600 text-white border-transparent",
  muted: "bg-white hover:bg-gray-200 text-gray-800 border-transparent",
  outline: "bg-transparent hover:bg-gray-100 text-gray-800 border-gray-200 border-2",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-transparent",
  danger: "bg-rose-600 hover:bg-rose-700 text-white border-transparent",
  "danger-outline": "bg-transparent hover:bg-rose-50 text-rose-600 border-rose-200",
  "danger-muted": "bg-rose-50 hover:bg-rose-100 text-rose-600 border-transparent",
  google: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 shadow-none",
};

const sizeStyles = {
  sm: "h-8 sm:h-9 text-xs sm:text-sm rounded-lg sm:rounded-xl",
  md: "h-10 sm:h-12 text-sm sm:text-base rounded-xl sm:rounded-2xl",
  lg: "h-12 sm:h-14 text-base sm:text-lg rounded-2xl sm:rounded-3xl",
};

const baseBtnStyles =
  "inline-flex items-center gap-2.5 sm:gap-3 font-medium transition-all duration-100 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed border";

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  arrowIcon = true,
  startIcon,
  endIcon,
  loading = false,
  fullWidth = false,
  link,
  disabled = false,
  ...props
}) {
  const isPillWithBadge = variant === "primary";
  const isDisabled = disabled || loading;

  const paddingStyles = arrowIcon && !startIcon && !endIcon
    ? "pl-1.5 pr-4 sm:pl-2 sm:pr-6 py-1.5 sm:py-2 justify-between"
    : size === "sm"
    ? "px-3 py-1 sm:px-4 sm:py-1.5 justify-center"
    : size === "lg"
    ? "px-6 py-3 sm:px-8 sm:py-3.5 justify-center"
    : "px-4 py-2 sm:px-6 sm:py-2.5 justify-center"; 

  const sizeStyle = sizeStyles[size] || sizeStyles.md;
  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const disabledStyles = isDisabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "";
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedClassName = `${baseBtnStyles} ${sizeStyle} ${variantStyle} ${paddingStyles} ${widthStyles} ${disabledStyles} ${className}`.trim();

  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 sm:size-5 animate-spin shrink-0" />
      ) : (
        startIcon && <span className="shrink-0 flex items-center justify-center">{startIcon}</span>
      )}

      {children && <span>{children}</span>}

      {endIcon && !arrowIcon && (
        <span className="shrink-0 flex items-center justify-center">{endIcon}</span>
      )}

      {arrowIcon && !endIcon && (
        <span
          className={`size-7 sm:size-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 ${
            isPillWithBadge
              ? "bg-white text-gray-900"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          <ArrowUpLeft className="size-3.5 sm:size-4" strokeWidth={2.5} />
        </span>
      )}
    </>
  );

  if (link && !isDisabled) {
    return (
      <Link href={link} className={combinedClassName} {...props}>
        {content}
      </Link>
    );
  }

  if (link && isDisabled) {
    return (
      <span aria-disabled="true" className={combinedClassName} {...props}>
        {content}
      </span>
    );
  }

  return (
    <button disabled={isDisabled} className={combinedClassName} {...props}>
      {content}
    </button>
  );
}

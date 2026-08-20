"use client";

import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";

const variantStyles = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white border-transparent",
  secondary: "bg-secondary-500 hover:bg-secondary-600 text-white border-transparent",
  muted: "bg-white hover:bg-gray-200 text-gray-800 border-transparent",
  outline: "bg-transparent hover:bg-gray-100 text-gray-800 border-gray-200 border-2",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-transparent",
};

const baseBtnStyles =
  "inline-flex items-center justify-between gap-2.5 sm:gap-3 h-10 sm:h-12 rounded-xl sm:rounded-2xl font-medium transition-all duration-100 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed text-sm sm:text-base border";

export default function Button({
  children,
  className = "",
  variant = "primary",
  arrowIcon = true,
  link,
  disabled = false,
  ...props
}) {
  const isPillWithBadge = variant === "primary";
  const paddingStyles = arrowIcon
    ? "pl-1.5 pr-4 sm:pl-2 sm:pr-6 py-1.5 sm:py-2"
    : "px-4 py-2 sm:px-6 sm:py-2.5 justify-center";
  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const disabledStyles = disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "";
  const combinedClassName = `${baseBtnStyles} ${variantStyle} ${paddingStyles} ${disabledStyles} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>
      {arrowIcon && (
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

  if (link && !disabled) {
    return (
      <Link href={link} className={combinedClassName} {...props}>
        {content}
      </Link>
    );
  }

  if (link && disabled) {
    return (
      <span aria-disabled="true" className={combinedClassName} {...props}>
        {content}
      </span>
    );
  }

  return (
    <button disabled={disabled} className={combinedClassName} {...props}>
      {content}
    </button>
  );
}

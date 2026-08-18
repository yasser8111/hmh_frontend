"use client";

import { Check } from "lucide-react";

export default function Checkbox({
  children,
  label,
  checked,
  onChange,
  className = "",
  id,
  ...props
}) {
  const content = children || label;
  const checkboxId = id || (typeof content === "string" ? content.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`group inline-flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform select-none ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Hidden Native Input */}
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />

        {/* Custom Styled Box */}
        <div className="size-5 rounded-lg border-2 border-gray-200 bg-white transition-all duration-200 ease-out group-hover:border-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20 flex items-center justify-center">
          <Check
            className="size-3.5 stroke-3 text-white"
          />
        </div>
      </div>

      {/* Label Text */}
      {content && (
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
          {content}
        </span>
      )}
    </label>
  );
}

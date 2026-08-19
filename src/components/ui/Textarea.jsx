"use client";

export default function Textarea({
  label,
  error,
  helperText,
  rows = 3,
  className = "",
  containerClassName = "",
  id,
  ...props
}) {
  const textareaId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  const baseStyles =
    "w-full px-4 py-3 rounded-2xl border-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-y";

  const borderStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-primary/20";

  return (
    <div className={`flex flex-col gap-1 w-full ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-gray-700 select-none">
          {label}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={textareaId}
        rows={rows}
        value={props.value !== undefined ? props.value : ""}
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      />

      {/* Error / Helper Message */}
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    rows = 2,
    className = "",
    containerClassName = "",
    id,
    value,
    defaultValue,
    onChange,
    onInput,
    ...props
  },
  ref
) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current);

  const textareaId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  // Auto-resize textarea height to match content
  const adjustHeight = () => {
    const textarea = innerRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const borderOffset = textarea.offsetHeight - textarea.clientHeight;
    textarea.style.height = `${textarea.scrollHeight + borderOffset}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value, defaultValue]);

  const handleInput = (e) => {
    adjustHeight();
    if (onInput) onInput(e);
  };

  const handleChange = (e) => {
    adjustHeight();
    if (onChange) onChange(e);
  };

  const baseStyles =
    "w-full px-4 py-3 rounded-2xl border-2 text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:border-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed resize-none";

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
        ref={innerRef}
        id={textareaId}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onInput={handleInput}
        onChange={handleChange}
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
});

export default Textarea;


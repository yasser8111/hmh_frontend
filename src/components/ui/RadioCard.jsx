"use client";

export default function RadioCard({
  title,
  description,
  icon: Icon,
  selected = false,
  disabled = false,
  layout = "horizontal", // "horizontal" | "vertical"
  onClick,
  className = "",
  children,
  ...props
}) {
  const isVertical = layout === "vertical";

  if (isVertical) {
    return (
      <div
        onClick={!disabled ? onClick : undefined}
        className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-center gap-2.5 h-auto touch-manipulation select-none active:scale-[0.98] ${disabled
            ? "border-gray-200 bg-gray-50/40 opacity-60 cursor-not-allowed"
            : selected
              ? "bg-primary-50/80 border-primary-400 cursor-pointer shadow-xs"
              : "bg-white border-gray-200 hover:border-primary-200 cursor-pointer"
          } ${className}`}
        {...props}
      >
        {Icon && (
          <div className="flex items-center justify-between w-full">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selected ? "bg-primary-500 text-white" : "bg-primary-50 text-primary-600"
                }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        )}

        <div>
          {title && (
            <h4 className="font-bold text-gray-950 text-sm line-clamp-2" title={title}>{title}</h4>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>
          )}
          {children}
        </div>
      </div>
    );
  }

  // Default Horizontal Layout
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 touch-manipulation select-none active:scale-[0.98] ${disabled
          ? "border-gray-200 bg-gray-50/40 opacity-60 cursor-not-allowed"
          : selected
            ? "bg-primary-50/80 border-primary-400 cursor-pointer"
            : "bg-gray-50/50 border-gray-200 hover:bg-gray-100/60 cursor-pointer"
        } ${className}`}
      {...props}
    >
      {/* Icon */}
      {Icon && (
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${disabled
              ? "bg-gray-200 text-gray-400"
              : selected
                ? "bg-primary-500 text-white"
                : "bg-primary-50 text-primary-600"
            }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {title && (
            <h4
              className={`text-xs font-bold truncate ${disabled ? "text-gray-500" : "text-gray-950"
                }`}
            >
              {title}
            </h4>
          )}
        </div>

        {description && (
          <p
            className={`text-[11px] mt-1 leading-relaxed ${disabled ? "text-gray-400" : "text-gray-600"
              }`}
          >
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

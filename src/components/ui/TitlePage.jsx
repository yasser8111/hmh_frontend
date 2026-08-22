import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TitlePage({
  title,
  children,
  as = "h2", // Default is h2 for subpages, pass as="h1" for main landing/dashboard
  align = "right",
  backLink,
  backLabel = "العودة",
  className = "",
  titleClassName = "",
  ...props
}) {
  const headingText = title || children;
  const HeadingTag = as === "h1" ? "h1" : "h2";

  const alignStyles = {
    right: "text-right",
    center: "text-center",
    left: "text-left",
  };

  // h1 is full hero size, h2 is slightly smaller with identical premium typography
  const headingSizeStyles =
    as === "h1"
      ? "text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight sm:leading-tight"
      : "text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-950 tracking-tight leading-snug sm:leading-tight";

  return (
    <div
      className={`pt-1 sm:pt-2 pb-1 sm:pb-2 space-y-1 sm:space-y-1.5 ${alignStyles[align] || "text-right"
        } ${className}`}
      {...props}
    >
      {backLink && (
        <div className="pb-1">
          <Link
            href={backLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-500 transition-colors group cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{backLabel}</span>
          </Link>
        </div>
      )}

      <HeadingTag
        className={`wrap-break-words ${headingSizeStyles} ${titleClassName}`}
      >
        {headingText}
      </HeadingTag>
    </div>
  );
}

export { TitlePage };

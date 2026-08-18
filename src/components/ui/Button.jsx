import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";

export default function Button({
    children,
    className = "",
    variant = "primary",
    arrowIcon = true,
    link,
    ...props
}) {
    const isPillWithBadge = variant === "primary" || variant === "secondary";
    const paddingStyles = arrowIcon ? "pl-2 pr-6 py-2" : "px-6 py-2.5 justify-center";
    const combinedClassName = `btn btn-${variant} ${paddingStyles} ${className}`;

    const content = (
        <>
            <span>{children}</span>
            {arrowIcon && (
                <span
                    className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 ${isPillWithBadge
                            ? "bg-white text-gray-900 shadow-xs"
                            : "bg-gray-200 text-gray-900"
                        }`}
                >
                    <ArrowUpLeft className="size-4" strokeWidth={2.5} />
                </span>
            )}
        </>
    );

    if (link) {
        return (
            <Link href={link} className={combinedClassName} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button className={combinedClassName} {...props}>
            {content}
        </button>
    );
}

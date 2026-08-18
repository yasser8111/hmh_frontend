import Link from "next/link";

export default function Card({
    children,
    className = "",
    link,
    isSquare = false,
    ...props
}) {
    const isSquareClasses = isSquare ? "aspect-square w-full object-cover object-center" : "";
    const combinedClasses = `relative isolate rounded-2xl lg:rounded-3xl overflow-hidden ${isSquareClasses} ${className}`;
    if (link) {
        return (
            <Link
                href={link}
                className={combinedClasses}
                {...props}
            >
                {children}
            </Link>
        );
    }
    return (
        <div
            className={combinedClasses}
            {...props}
        >
            {children}
        </div>
    );
}

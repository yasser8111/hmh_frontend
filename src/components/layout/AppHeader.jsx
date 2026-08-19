"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function LogoSection() {
  return (
    <div className="flex items-center">
      <Link href="/app">
        <Image src="/logo.png" alt="Logo" width={48} height={48} priority />
      </Link>
    </div>
  );
}

export function NavSection() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "حجز موعد", href: "/app/booking" },
    { label: "مواعيدي", href: "/app/appointments" },
    { label: "الأطباء", href: "/app/doctors" },
    { label: "الأقسام", href: "/app/departments" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Desktop navigation */}
      <nav className="items-center gap-6 hidden lg:flex ms-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile fixed trigger and menu */}
      <div className="lg:hidden fixed top-3.5 end-4 sm:end-6 md:end-8 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-label="فتح القائمة"
          className="w-11 h-11 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-700 hover:text-gray-900 focus:outline-none active:shadow-sm shadow-md cursor-pointer active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 transition-opacity"
            aria-hidden="true"
          />
        )}

        {isOpen && (
          <div
            className={`absolute top-0 end-0 z-50 w-64 max-w-[calc(100vw-2rem)] p-4 bg-white border border-gray-200 rounded-2xl shadow-xl transition-all duration-200 ease-out origin-top-right rtl:origin-top-left ${isOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-sm font-semibold text-gray-800">القائمة</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors rounded-lg"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function AppHeader() {
  return (
    <header className="w-full h-16 px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between">
      <LogoSection />
      <NavSection />
    </header>
  );
}


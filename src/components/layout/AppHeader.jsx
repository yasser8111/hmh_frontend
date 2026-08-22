"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function LogoSection() {
  return (
    <div className="flex items-center">
      <Link href="/app">
        <Image
          src="/logo.png"
          alt="شعار مستشفى حضرموت الحديث"
          width={130}
          height={42}
          className="h-9 w-auto object-contain"
          priority
        />
      </Link>
    </div>
  );
}

export function NavSection() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "الرئيسية", href: "/app" },
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
        {navItems.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium transition-colors ${isActive
                  ? "text-primary-500 font-semibold"
                  : "text-gray-700 hover:text-primary-500"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* Mobile Morphing Menu */}
      <div className="lg:hidden fixed top-3.5 end-4 sm:end-6 md:end-8 z-50">
        <div
          className={`relative bg-white border border-gray-200 overflow-hidden shadow-md origin-top-right rtl:origin-top-left transition-all ${isOpen
              ? "w-64 h-[330px] rounded-2xl shadow-xl border-gray-300/80 duration-400 ease-[cubic-bezier(0.34,1.35,0.64,1)]"
              : "w-11 h-11 rounded-xl shadow-sm hover:border-gray-300 hover:bg-gray-50 active:scale-95 duration-300 ease-in-out"
            }`}
        >
          {/* Animated 2-lines into X toggle button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            className="w-11 h-11 absolute top-0 end-0 z-20 flex flex-col items-center justify-center gap-[5px] text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer rounded-xl hover:bg-gray-100/60 active:scale-95 transition-all"
          >
            <span
              className={`w-5 h-[2px] bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${isOpen ? "translate-y-[3.5px] rotate-45 bg-gray-800" : "translate-y-0"
                }`}
            />
            <span
              className={`w-5 h-[2px] bg-gray-700 rounded-full transition-all duration-300 ease-in-out ${isOpen ? "-translate-y-[3.5px] -rotate-45 bg-gray-800" : "translate-y-0"
                }`}
            />
          </button>

          {/* Menu Content (Header title + Nav links) */}
          <div
            className={`w-64 flex flex-col transition-all ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto duration-300 delay-100 ease-out"
                : "opacity-0 -translate-y-2 pointer-events-none duration-150 ease-in"
              }`}
          >
            {/* Header Title */}
            <div className="h-11 flex items-center ps-4 pe-11">
              <span className="text-sm font-semibold text-gray-800">القائمة</span>
            </div>
            <div className="h-[1px] bg-gray-100 mx-3" />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 p-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? "bg-primary-50 text-primary-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
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

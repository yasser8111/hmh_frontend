"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, Menu, X } from "lucide-react";

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

function ProfileAvatarButton({ pathname, className = "" }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_avatar");
      if (stored) setAvatarUrl(stored);
    } catch { }
  }, []);

  const isActive = pathname === "/app/profile";

  return (
    <Link
      href="/app/profile"
      aria-label="الملف الشخصي"
      className={`rounded-xl flex items-center justify-center overflow-hidden transition-all hover:bg-gray-50 active:scale-95 cursor-pointer shrink-0 ${isActive
          ? "border border-primary-500 text-primary-600 bg-primary-50/50"
          : "text-gray-700 hover:text-primary-600"
        } ${className}`}
    >
      {avatarUrl && !imageError ? (
        <img
          src={avatarUrl}
          alt="الملف الشخصي"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <User className="w-5 h-5" />
      )}
    </Link>
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
      <div className="hidden lg:flex items-center gap-5 ms-auto">
        <nav className="flex items-center gap-6">
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

        <div className="w-[1px] h-6 bg-gray-200" />

        {/* Profile Avatar Box on desktop */}
        <ProfileAvatarButton
          pathname={pathname}
          className="w-11 h-11 bg-white border border-gray-200 hover:border-gray-300"
        />
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* Mobile Unified Container (Profile + Menu toggle inside one unified capsule) */}
      <div className="lg:hidden fixed top-3.5 end-4 sm:end-6 md:end-8 z-50">
        <div className="relative bg-white border border-gray-200 rounded-2xl p-1 flex items-center gap-1 shadow-lg">
          {/* Profile Avatar Button */}
          <ProfileAvatarButton
            pathname={pathname}
            className="w-9 h-9 hover:bg-gray-100/70"
          />

          {/* <div className="w-[1px] h-5 bg-gray-200" /> */}

          {/* Menu Toggle Button using clean Menu/X icons */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-950 focus:outline-none cursor-pointer rounded-xl hover:bg-gray-100/70 active:scale-95 transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Standard Dropdown Menu */}
          <div
            className={`absolute top-13 end-0 w-64 bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 ease-out origin-top-right rtl:origin-top-left ${isOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            {/* Header Title */}
            <div className="h-11 flex items-center ps-4 pe-4">
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

              <Link
                href="/app/profile"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === "/app/profile"
                    ? "bg-primary-50 text-primary-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                الملف الشخصي
              </Link>
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

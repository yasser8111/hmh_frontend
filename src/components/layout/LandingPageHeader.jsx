"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Card } from "@/components/ui";

export default function LandingPageHeader() {
  const navLinks = [
    { label: "الرئيسية", href: "#hero" },
    { label: "من نحن", href: "#about" },
    { label: "أقسامنا", href: "#departments" },
    { label: "الأسئلة الشائعة", href: "#faq" },
    { label: "تواصل معنا", href: "#contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-10 py-6 transition-all duration-300">
      <Card className="bg-transparent border-0 shadow-none px-0 py-0">
        <div className="flex items-center justify-between gap-4">
          {/* 1. Logo (Right in RTL / Start) */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="شعار مستشفى حضرموت الحديث"
                width={130}
                height={42}
                className="h-9 lg:h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* 2. Centered Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-1">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm lg:text-base font-medium text-gray-700 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 3. Action Button (Left in RTL / End) */}
          <div className="flex items-center justify-end">
            <Button link="/app/booking">
              احجز الآن
            </Button>
          </div>
        </div>
      </Card>
    </header>
  );
}

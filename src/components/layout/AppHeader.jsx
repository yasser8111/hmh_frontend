"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Calendar, Home, Stethoscope, User, Building2, Plus } from "lucide-react";

export default function AppHeader() {
  const pathname = usePathname();

  const navItems = [
    { label: "حجز موعد", href: "/app/booking", icon: Calendar },
    { label: "مواعيدي", href: "/app/appointments", icon: Calendar },
    { label: "الأطباء", href: "/app/doctors", icon: Stethoscope },
    { label: "الأقسام", href: "/app/departments", icon: Building2 },
  ];

  return (
    <header className="w-full h-16 mt-4 px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between">
      <Image src="/logo.png" alt="Logo" width={50} height={50} />
      <nav className="items-center gap-4 hidden lg:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-primary-500 transition-all">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";

export default function AuthLayout({ children }) {
  return (
    <main className="section relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
      {/* Logo Top Right */}
      <Link
        href="/"
        className="absolute top-4 sm:top-6 md:top-8 lg:top-10 right-4 sm:right-6 md:right-8 lg:right-10 z-20 shrink-0"
      >
        <Image
          src="/logo.png"
          alt="شعار مستشفى حضرموت الحديث"
          width={130}
          height={42}
          className="h-9 lg:h-10 w-auto object-contain"
          priority
        />
      </Link>

      {/* Form Column */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center pt-14 sm:pt-16 lg:pt-0">
        {children}
      </div>

      {/* Image Card Column */}
      <Card className="flex-1 w-full hidden lg:block self-stretch">
        <Image
          src="/images/hero_doctor_patient.png"
          alt="doctor"
          fill
          priority
          className="object-cover"
        />
      </Card>
    </main>
  );
}
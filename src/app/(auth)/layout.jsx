import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen lg:h-screen w-full mx-auto flex flex-col lg:flex-row items-stretch justify-between relative lg:overflow-hidden">
      {/* Logo Top Right */}
      <Link
        href="/"
        className="absolute top-6 sm:top-8 right-6 sm:right-8 z-20 shrink-0"
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

      {/* Form Column - Content on the Right */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-start px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-0 lg:h-full lg:overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-full lg:mt-36 pb-12">
          {children}
        </div>
      </div>

      {/* Image Column with dedicated padding */}
      <div className="flex-1 w-full hidden lg:block p-4 sm:p-6 md:p-8 lg:p-10 h-full shrink-0">
        <Card className="w-full h-full relative overflow-hidden border-0">
          <Image
            src="/images/hero_doctor_patient.png"
            alt="doctor"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </Card>
      </div>
    </main>
  );
}
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui";

export default function AuthLayout({ children }) {
  return (
    <main className="section flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 ">
      {/* Form Column */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center">
        <Link href="/" className="inline-block mb-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={130}
            height={42}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
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
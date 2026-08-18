"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button, Card } from "@/components/ui";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer id="contact" className="section flex flex-col">
      {/* <Card className="flex-1 w-full h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gray-100 border-none shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 my-auto">
          <div className="flex flex-col items-start justify-between gap-8">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="شعار مستشفى حضرموت الحديث"
                width={200}
                height={65}
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
              />
            </Link>

            <div className="space-y-4">
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-xs">
                رعاية صحية متكاملة بأحدث المعايير الطبية لخدمتكم على مدار الساعة.
              </p>

              <div>
                <Link href="/booking" className="inline-block">
                  <Button variant="primary">
                    احجز الآن
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight">
              الروابط السريعة
            </h3>
            <ul className="space-y-3.5 text-sm lg:text-base">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/#departments" className="text-gray-600 hover:text-primary-600 transition-colors">
                  الأقسام الطبية
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-gray-600 hover:text-primary-600 transition-colors">
                  أطباؤنا الكرام
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-600 hover:text-primary-600 transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight">
              الخدمات والتخصصات
            </h3>
            <ul className="space-y-3.5 text-sm lg:text-base">
              <li>
                <Link href="/departments/cardiology" className="text-gray-600 hover:text-primary-600 transition-colors">
                  قسم أمراض القلب والباطنية
                </Link>
              </li>
              <li>
                <Link href="/departments/surgery" className="text-gray-600 hover:text-primary-600 transition-colors">
                  قسم الجراحة والمناظير
                </Link>
              </li>
              <li>
                <Link href="/departments/emergency" className="text-gray-600 hover:text-primary-600 transition-colors">
                  قسم الطوارئ والحوادث (24/7)
                </Link>
              </li>
              <li>
                <Link href="/departments/pediatrics" className="text-gray-600 hover:text-primary-600 transition-colors">
                  طب الأطفال وحديثي الولادة
                </Link>
              </li>
              <li>
                <Link href="/departments/radiology" className="text-gray-600 hover:text-primary-600 transition-colors">
                  المختبرات والأشعة التشخيصية
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight">
              معلومات التواصل
            </h3>
            <div className="space-y-4 text-sm lg:text-base text-gray-600">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span dir="ltr" className="font-mono text-gray-800 font-medium">
                  +967 5 300 000
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span className="font-mono text-gray-800">info@hmh.med</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span>المكلا - حضرموت - الجمهورية اليمنية</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs lg:text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-center sm:text-right">
            <span>© {currentYear} مستشفى حضرموت الحديث. جميع الحقوق محفوظة.</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-primary-600 transition-colors">
              الشروط والأحكام
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="size-9 rounded-full bg-white text-gray-600 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter / X"
              className="size-9 rounded-full bg-white text-gray-600 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="size-9 rounded-full bg-white text-gray-600 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </Card> */}
    </footer>
  );
}

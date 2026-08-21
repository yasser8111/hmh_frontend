import { Alexandria } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata = {
  title: "مستشفى حضرموت الحديث | الرعاية الصحية المتكاملة",
  description: "البوابة الإلكترونية لمستشفى حضرموت الحديث - حجز المواعيد والاستشارات الطبية",
};

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable} data-scroll-behavior="smooth">
      <body
        className={`${alexandria.className} antialiased max-w-[1920px] mx-auto min-h-screen`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

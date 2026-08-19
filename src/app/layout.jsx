import { Alexandria } from "next/font/google";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={alexandria.variable} data-scroll-behavior="smooth">
      <body
        className={`${alexandria.className} antialiased max-w-[1920px] mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

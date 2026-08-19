import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main>
      <section className="section flex flex-col items-center justify-center text-center gap-8">
        <span className="text-7xl sm:text-8xl md:text-9xl font-black font-mono text-primary-500 tracking-tight select-none">
          404
        </span>

        <div className="space-y-3 max-w-md">
          <h3 className="text-2xl sm:text-3xl md:text-4xl xl:text-4xl font-bold leading-relaxed">
            عذراً، الصفحة غير موجودة
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            الصفحة التي تحاول الوصول إليها قد تكون حُذفت، تغيّر اسمها، أو غير متاحة مؤقتاً.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-sm">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" arrowIcon={false} className="w-full sm:w-auto justify-center">
              العودة للرئيسية
            </Button>
          </Link>
          <Link href="/#contact" className="w-full sm:w-auto">
            <Button variant="outline" arrowIcon={false} className="w-full sm:w-auto justify-center">
              تواصل معنا
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

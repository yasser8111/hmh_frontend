import AppHeader from "@/components/layout/AppHeader";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 mx-auto flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">الأقسام والعيادات التخصصية</h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            استكشف أكثر من 15 قسماً طبياً متكاملاً مجهزاً بأحدث التقنيات الطبية في مستشفى حضرموت الحديث.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-all"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

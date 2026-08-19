"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/app";

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log("Login Result:", result);

      if (result.success) {
        router.push(redirectUrl);
        router.refresh();
      } else {
        setErrorMsg(result.message || "فشل تسجيل الدخول");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl sm:text-3xl font-bold leading-relaxed mb-6">تسجيل الدخول</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email / Phone Field */}
        <Input
          label="البريد الإلكتروني أو رقم الهاتف"
          type="text"
          required
          placeholder="example@mail.com"
          value={formData.emailOrPhone}
          onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
        />

        {/* Password Field */}
        <Input
          label="كلمة المرور"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errorMsg && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-3xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-2">
          <Button
            type="submit"
            className="w-full justify-center"
            arrowIcon={false}
            disabled={loading}
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
        </div>
      </form>

      {/* Footer link to Sign up */}
      <p className="text-center text-sm text-gray-600 mt-6">
        ليس لديك حساب بعد؟{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox } from "@/components/ui";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة");
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMsg("يرجى الموافقة على الشروط والأحكام للمتابعة");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/siginup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && (result.success !== false)) {
        // توجيه تلقائي ومباشر إلى صفحة تسجيل الدخول
        router.push("/login");
      } else {
        setErrorMsg(result.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (err) {
      console.error("Signup request error:", err);
      setErrorMsg("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="h3 mb-6">إنشاء حساب</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Full Name */}
        <Input
          label="الاسم الكامل"
          type="text"
          required
          placeholder="محمد عبدالله باوزير"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        {/* Email or Phone */}
        <Input
          label="البريد الإلكتروني أو رقم الهاتف"
          type="text"
          required
          placeholder="example@mail.com"
          value={formData.emailOrPhone}
          onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
        />

        {/* Password */}
        <Input
          label="كلمة المرور"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        {/* Confirm Password */}
        <Input
          label="تأكيد كلمة المرور"
          type="password"
          required
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />

        {/* Terms and conditions */}
        <div className="mt-1 flex gap-2 items-center">
          <Checkbox
            id="terms"
            required
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
          />

          <span className="text-xs text-gray-600">
            أوافق على{" "}
            <Link href="/terms" className="text-primary underline font-medium">
              الشروط والأحكام
            </Link>{" "}
            و{" "}
            <Link href="/privacy" className="text-primary underline font-medium">
              سياسة الخصوصية
            </Link>
          </span>

        </div>

        {errorMsg && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border-2 border-red-200 rounded-3xl text-center">
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
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </div>
      </form>

      {/* Footer link to Sign in */}
      <p className="text-center text-sm text-gray-600 mt-6">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}

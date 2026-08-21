"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox, RadioCard, DatePicker } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "M",
    dateOfBirth: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      const msg = "كلمات المرور غير متطابقة";
      setErrorMsg(msg);
      toast.warning("تطابق كلمة المرور", msg);
      return;
    }

    if (!formData.termsAccepted) {
      const msg = "يرجى الموافقة على الشروط والأحكام للمتابعة";
      setErrorMsg(msg);
      toast.warning("الشروط والأحكام", msg);
      return;
    }

    if (!formData.phone.trim()) {
      const msg = "يرجى إدخال رقم الهاتف للتحقق من الحساب";
      setErrorMsg(msg);
      toast.warning("رقم الهاتف", msg);
      return;
    }

    if (!formData.dateOfBirth) {
      const msg = "يرجى تحديد تاريخ الميلاد";
      setErrorMsg(msg);
      toast.warning("تاريخ الميلاد", msg);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success !== false) {
        toast.success("تم إرسال رمز التحقق بنجاح", "يرجى إدخال الرمز لتفعيل حسابك");
        const phone = result?.data?.phone || formData.phone.trim();
        const userId = result?.data?.user_id
          ? `&user_id=${encodeURIComponent(result.data.user_id)}`
          : "";
        router.push(`/otp?target=${encodeURIComponent(phone)}&from=signup${userId}`);
      } else {
        const msg = result.message || "حدث خطأ أثناء إنشاء الحساب";
        setErrorMsg(msg);
        toast.error("فشل إنشاء الحساب", msg);
      }
    } catch (err) {
      const msg = "حدث خطأ في الاتصال بالخادم";
      setErrorMsg(msg);
      toast.error("فشل الاتصال", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl sm:text-3xl font-bold leading-relaxed mb-6">إنشاء حساب</h3>

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

        {/* Email */}
        <Input
          label="البريد الإلكتروني"
          type="email"
          required
          placeholder="example@mail.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Phone */}
        <Input
          label="رقم الهاتف"
          type="tel"
          required
          inputMode="numeric"
          placeholder="77XXXXXXX"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

        {/* Gender */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 select-none">
            الجنس
          </label>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              title="ذكر"
              layout="vertical"
              selected={formData.gender === "M"}
              onClick={() => setFormData({ ...formData, gender: "M" })}
              className="py-2 text-center items-center justify-center"
            />
            <RadioCard
              title="أنثى"
              layout="vertical"
              selected={formData.gender === "F"}
              onClick={() => setFormData({ ...formData, gender: "F" })}
              className="py-3 px-4 text-center items-center justify-center"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <DatePicker
          label="تاريخ الميلاد"
          required
          value={formData.dateOfBirth}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
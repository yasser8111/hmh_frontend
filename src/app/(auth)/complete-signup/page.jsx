"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Checkbox } from "@/components/ui";

const selectStyles =
  "w-full px-4 py-4 lg:py-2.5 rounded-2xl border-2 border-gray-200 text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-primary hover:border-gray-300";

export default function CompleteSignupPage() {
  const router = useRouter();
  const [oauthData, setOauthData] = useState(null);
  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    gender: "M",
    dateOfBirth: "",
    whatsappOptIn: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("oauth_signup_data");
    if (!raw) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    try {
      const data = JSON.parse(raw);
      if (!data.id_token) {
        router.replace("/login");
        return;
      }
      queueMicrotask(() => {
        if (!cancelled) {
          setOauthData(data);
          setReady(true);
        }
      });
    } catch {
      router.replace("/login");
    }

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.phone.trim()) {
      setErrorMsg("يرجى إدخال رقم الهاتف");
      return;
    }
    if (!formData.dateOfBirth) {
      setErrorMsg("يرجى تحديد تاريخ الميلاد");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/google/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: oauthData.id_token,
          phone: formData.phone.trim(),
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          whatsapp_opt_in: formData.whatsappOptIn,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success !== false) {
        sessionStorage.removeItem("oauth_signup_data");
        const phone = result?.data?.phone || formData.phone.trim();
        const userId = result?.data?.user_id
          ? `&user_id=${encodeURIComponent(result.data.user_id)}`
          : "";
        router.push(`/otp?target=${encodeURIComponent(phone)}&from=google${userId}`);
      } else {
        setErrorMsg(result.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (err) {
      console.error("Google signup request error:", err);
      setErrorMsg("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !oauthData) {
    return <div className="text-center py-8 text-gray-500">جاري التحميل...</div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl sm:text-3xl font-bold leading-relaxed mb-6">أكمل بياناتك</h3>
      <p className="text-sm text-gray-500 mb-6">
        مرحباً بك! أكمل بياناتك وسنرسل رمز تحقق إلى رقم هاتفك
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Prefilled (read-only) */}
        <Input
          label="الاسم الكامل"
          type="text"
          value={oauthData.full_name || ""}
          disabled
          readOnly
        />
        <Input
          label="البريد الإلكتروني"
          type="email"
          value={oauthData.email || ""}
          disabled
          readOnly
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

        {/* Gender */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700 select-none">
            الجنس
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className={selectStyles}
          >
            <option value="M">ذكر</option>
            <option value="F">أنثى</option>
          </select>
        </div>

        {/* Date of Birth */}
        <Input
          label="تاريخ الميلاد"
          type="date"
          required
          value={formData.dateOfBirth}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        />

        {/* WhatsApp Opt-in */}
        <div className="mt-1 flex gap-2 items-center">
          <Checkbox
            id="whatsapp-opt-in"
            checked={formData.whatsappOptIn}
            onChange={(e) => setFormData({ ...formData, whatsappOptIn: e.target.checked })}
          />
          <span className="text-xs text-gray-600">
            أوافق على استقبال التذكيرات والتنبيهات عبر واتساب
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
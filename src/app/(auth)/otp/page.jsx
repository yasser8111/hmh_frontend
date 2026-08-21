"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, InputOTP } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

function OTPForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("target") || "";
  const userId = searchParams.get("user_id") || "";

  const [phone, setPhone] = useState(initialPhone);
  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otp;
    if (!phone || !code || code.length < 6) {
      const msg = "يرجى إدخال الرمز المكون من 6 أرقام";
      setErrorMsg(msg);
      toast.warning("رمز التحقق", msg);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });
      const data = await res.json();

      if (res.ok && data.success !== false) {
        toast.success("تم تفعيل الحساب بنجاح!", "مرحباً بك في مستشفى حضرموت الحديث");
        router.push("/app");
        router.refresh();
      } else {
        const msg = data.message || "رمز التحقق غير صحيح";
        setErrorMsg(msg);
        toast.error("خطأ في التحقق", msg);
      }
    } catch (err) {
      const msg = "حدث خطأ أثناء التحقق من الرمز";
      setErrorMsg(msg);
      toast.error("فشل التحقق", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok && data.success !== false) {
        const msg = "تمت إعادة إرسال رمز التحقق بنجاح";
        setSuccessMsg(msg);
        toast.info("إعادة إرسال الرمز", msg);
      } else {
        const msg = data.message || "فشل إعادة إرسال الرمز";
        setErrorMsg(msg);
        toast.error("فشل الإرسال", msg);
      }
    } catch (err) {
      const msg = "حدث خطأ أثناء إعادة إرسال الرمز";
      setErrorMsg(msg);
      toast.error("فشل الاتصال", msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    const newPhone = phoneInput.trim();
    if (!newPhone) {
      const msg = "يرجى إدخال رقم الهاتف";
      setErrorMsg(msg);
      toast.warning("رقم الهاتف", msg);
      return;
    }
    if (!userId) {
      const msg = "غير قادر على تحديث رقم الهاتف";
      setErrorMsg(msg);
      toast.error("خطأ", msg);
      return;
    }

    setPhoneLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/signup/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, new_phone: newPhone }),
      });
      const data = await res.json();

      if (res.ok && data.success !== false) {
        setPhone(newPhone);
        const msg = "تم تحديث رقم الهاتف وإرسال رمز جديد";
        setSuccessMsg(msg);
        toast.success("تم التحديث بنجاح", msg);
      } else {
        const msg = data.message || "فشل تحديث رقم الهاتف";
        setErrorMsg(msg);
        toast.error("فشل التحديث", msg);
      }
    } catch (err) {
      const msg = "حدث خطأ أثناء تحديث رقم الهاتف";
      setErrorMsg(msg);
      toast.error("فشل الاتصال", msg);
    } finally {
      setPhoneLoading(false);
    }
  };

  const canEditPhone = Boolean(userId);

  return (
    <div className="w-full flex flex-col gap-6">
      <h3 className="text-2xl sm:text-3xl font-bold leading-relaxed mb-6">رمز التحقق</h3>

      <p className="-mt-3 mb-2 text-center text-sm text-gray-500">
        {phone ? (
          <>
            تم إرسال رمز التحقق إلى <span className="font-semibold text-gray-700" dir="ltr">{phone}</span>
          </>
        ) : (
          "أدخل الرمز المرسل إلى رقم هاتفك"
        )}
      </p>

      {canEditPhone && (
        <div className="flex flex-col gap-2">
          <Input
            label="رقم الهاتف"
            type="tel"
            required
            inputMode="numeric"
            placeholder="77XXXXXXX"
            dir="ltr"
            value={phoneInput}
            onChange={(e) => {
              setPhoneInput(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
          />
          <button
            type="button"
            onClick={handleUpdatePhone}
            disabled={phoneLoading || phoneInput.trim() === phone}
            className="self-start text-xs text-primary hover:underline font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phoneLoading ? "جاري التحديث..." : "تحديث الرقم وإعادة الإرسال"}
          </button>
        </div>
      )}

      <div className="flex justify-center my-2">
        <InputOTP
          length={6}
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (errorMsg) setErrorMsg("");
          }}
          onComplete={(code) => handleVerify(code)}
          error={Boolean(errorMsg)}
        />
      </div>

      {errorMsg && (
        <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          onClick={() => handleVerify()}
          disabled={loading || otp.length < 6}
          className="w-full justify-center"
          arrowIcon={false}
        >
          {loading ? "جاري التحقق..." : "تأكيد"}
        </Button>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-primary hover:underline font-semibold cursor-pointer"
          >
            {resendLoading ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
          </button>

          <Link href="/login" className="text-gray-500 hover:text-gray-800">
            تغيير الحساب
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-500">جاري التحميل...</div>}>
      <OTPForm />
    </Suspense>
  );
}

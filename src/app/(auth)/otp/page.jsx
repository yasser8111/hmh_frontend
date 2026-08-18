"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, InputOTP } from "@/components/ui";

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailOrPhone = searchParams.get("target") || "example@mail.com";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otp;
    if (!code || code.length < 6) {
      setErrorMsg("يرجى إدخال الرمز المكون من 6 أرقام");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, otp: code }),
      });
      const data = await res.json();

      if (res.ok && data.success !== false) {
        router.push("/app");
        router.refresh();
      } else {
        setErrorMsg(data.message || "رمز التحقق غير صحيح");
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء التحقق من الرمز");
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
        body: JSON.stringify({ emailOrPhone }),
      });
      const data = await res.json();

      if (res.ok && data.success !== false) {
        setSuccessMsg("تمت إعادة إرسال رمز التحقق بنجاح");
      } else {
        setErrorMsg(data.message || "فشل إعادة إرسال الرمز");
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء إعادة إرسال الرمز");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <h3 className="h3 mb-6">رمز التحقق</h3>

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

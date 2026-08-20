"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
console.log("google", GOOGLE_CLIENT_ID);

export default function GoogleSignInButton({ onError }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCredentialResponse = useCallback(
    async (response) => {
      const credential = response?.credential;
      if (!credential) {
        onError?.("تعذر الحصول على بيانات تسجيل الدخول من Google");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/auth/google/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: credential }),
        });
        const result = await res.json();

        if (result.needsVerification) {
          const phone = result.phone || "";
          router.push(`/otp?target=${encodeURIComponent(phone)}&from=google`);
        } else if (result.status === "success" || (res.ok && result.success)) {
          router.push("/app");
          router.refresh();
        } else if (result.status === "needs_signup" && result.signup_payload) {
          sessionStorage.setItem(
            "oauth_signup_data",
            JSON.stringify(result.signup_payload)
          );
          router.push("/complete-signup");
        } else {
          onError?.(result.message || "فشل تسجيل الدخول عبر Google");
        }
      } catch (err) {
        console.error("Google OAuth error:", err);
        onError?.("حدث خطأ في الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    },
    [router, onError]
  );

  const initGoogle = useCallback(() => {
    const g = window.google;
    if (!g?.accounts?.id || !GOOGLE_CLIENT_ID) return;

    g.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      cancel_on_tap_outside: false,
    });

    const btn = document.getElementById("google-signin-btn");
    if (btn) {
      g.accounts.id.renderButton(btn, {
        theme: "outline",
        size: "large",
        width: 300,
        locale: "ar",
      });
    }
  }, [handleCredentialResponse]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <div id="google-signin-btn" className="flex justify-center" />
      {loading && (
        <p className="text-center text-xs text-gray-500 mt-2">جاري تسجيل الدخول...</p>
      )}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogle}
      />
    </>
  );
}
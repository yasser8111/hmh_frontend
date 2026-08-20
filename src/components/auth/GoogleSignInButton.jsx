"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import Button from "@/components/ui/Button";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function GoogleIcon({ className = "size-5 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleSignInButton({ onError, children, className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);

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

    if (googleBtnRef.current) {
      g.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 380,
        locale: "ar",
      });
      setGoogleReady(true);
    }
  }, [handleCredentialResponse]);

  const handleManualClick = () => {
    if (loading) return;
    const g = window.google;
    if (g?.accounts?.id) {
      g.accounts.id.prompt();
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Custom styled Button */}
      <Button
        type="button"
        variant="google"
        fullWidth
        arrowIcon={false}
        startIcon={<GoogleIcon />}
        loading={loading}
        onClick={handleManualClick}
      >
        {children || "المتابعة باستخدام Google"}
      </Button>

      {/* Google Native Button Overlay */}
      <div
        ref={googleBtnRef}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full opacity-0 overflow-hidden cursor-pointer z-10 flex items-center justify-center ${
          loading || !googleReady ? "pointer-events-none" : ""
        }`}
      />

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogle}
      />
    </div>
  );
}
import { NextResponse } from "next/server";

const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function POST(request) {
  try {
    const body = await request.json();
    const phone = String(body.phone ?? body.emailOrPhone ?? "").trim();
    const otpCode = String(body.otp ?? body.code ?? "").trim();

    if (!phone || !otpCode) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال رقم الهاتف ورمز التحقق" },
        { status: 400 }
      );
    }

    const res = await fetch(`${backendApi}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: otpCode }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      const tokens = data?.data || data;
      const accessToken = tokens?.access_token;
      const refreshToken = tokens?.refresh_token;

      const response = NextResponse.json(
        {
          success: true,
          message: data?.message || "تم التحقق من الرمز بنجاح",
          data: tokens,
        },
        { status: 200 }
      );

      if (accessToken) {
        response.cookies.set("token", accessToken, {
          ...cookieOpts,
          maxAge: 60 * 60 * 24 * 7,
        });
      }
      if (refreshToken) {
        response.cookies.set("refresh_token", refreshToken, {
          ...cookieOpts,
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return response;
    }

    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: res.status }
    );
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}
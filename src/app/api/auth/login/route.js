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
    const { emailOrPhone, password } = body;
    const email = (emailOrPhone || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      );
    }

    const response = await fetch(`${backendApi}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      const tokens = data?.data || data;
      const accessToken = tokens?.access_token;
      const refreshToken = tokens?.refresh_token;

      const res = NextResponse.json(
        {
          success: true,
          message: data?.message || "تم تسجيل الدخول بنجاح",
          data: tokens,
        },
        { status: 200 }
      );

      if (accessToken) {
        res.cookies.set("token", accessToken, {
          ...cookieOpts,
          maxAge: 60 * 60 * 24 * 7,
        });
      }
      if (refreshToken) {
        res.cookies.set("refresh_token", refreshToken, {
          ...cookieOpts,
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return res;
    }

    if (response.status === 403) {
      return NextResponse.json(
        {
          success: false,
          needsVerification: true,
          phone: data?.phone || "",
          message: "هذا الحساب غير مفعّل. يرجى التحقق من رقم الهاتف",
        },
        { status: 403 }
      );
    }

    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail === "Invalid email or password"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data?.message || "فشل تسجيل الدخول";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: response.status }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}
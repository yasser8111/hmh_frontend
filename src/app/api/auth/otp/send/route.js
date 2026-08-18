import { NextResponse } from "next/server";

const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");

export async function POST(request) {
  try {
    const body = await request.json();
    const { emailOrPhone } = body;
    const phone = (emailOrPhone || "").trim();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال رقم الهاتف" },
        { status: 400 }
      );
    }

    const res = await fetch(`${backendApi}/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(
        {
          success: true,
          message: data?.message || "تم إرسال رمز التحقق بنجاح",
          data: data?.data || data,
        },
        { status: 200 }
      );
    }

    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data?.message || "فشل إرسال رمز التحقق";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: res.status }
    );
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}

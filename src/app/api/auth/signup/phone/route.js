import { NextResponse } from "next/server";

const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");

export async function POST(request) {
  try {
    const body = await request.json();
    const userId = String(body.user_id ?? "").trim();
    const newPhone = String(body.new_phone ?? "").trim();

    if (!userId || !newPhone) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال رقم الهاتف الجديد" },
        { status: 400 }
      );
    }

    const res = await fetch(`${backendApi}/auth/signup/phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, new_phone: newPhone }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(
        {
          success: true,
          message: data?.message || "تم تحديث رقم الهاتف وإرسال رمز جديد",
          data: data?.data || data,
        },
        { status: 200 }
      );
    }

    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail === "This phone number is already registered"
          ? "رقم الهاتف مسجل مسبقاً"
          : data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data?.message || "فشل تحديث رقم الهاتف";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: res.status }
    );
  } catch (error) {
    console.error("Signup phone update error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}
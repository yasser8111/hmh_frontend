import { NextResponse } from "next/server";

const backendApi = process.env.BACKEND_API;

export async function POST(request) {
  try {
    const body = await request.json();
    const idToken = String(body.id_token || "").trim();
    const phone = String(body.phone || "").trim();
    const dateOfBirth = String(body.date_of_birth || "").trim();

    if (!idToken || !phone || !dateOfBirth) {
      return NextResponse.json(
        { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    const response = await fetch(`${backendApi}/auth/google/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_token: idToken,
        phone,
        gender: body.gender || "M",
        date_of_birth: dateOfBirth,
        whatsapp_opt_in: Boolean(body.whatsapp_opt_in),
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return NextResponse.json(
        {
          success: true,
          status: "success",
          message:
            data?.message || "تم إنشاء الحساب بنجاح. يرجى التحقق من رقم الهاتف",
          data: data?.data || data,
        },
        { status: 200 }
      );
    }

    let errorMessage;
    if (response.status === 409) {
      errorMessage = "رقم الهاتف مسجل مسبقاً";
    } else {
      errorMessage =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail.map((d) => d.msg).join(", ")
          : response.status >= 500
          ? "خطأ في خادم الباك إند أثناء إنشاء الحساب"
          : data?.message || "فشل إنشاء الحساب";
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: response.status }
    );
  } catch (error) {
    console.error("Google signup API error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}
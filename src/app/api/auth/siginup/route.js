import { NextResponse } from "next/server";

const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, emailOrPhone, password } = body;

    if (!fullName || !emailOrPhone || !password) {
      return NextResponse.json(
        { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    const isEmail = emailOrPhone.includes("@");
    const payload = {
      full_name: fullName.trim(),
      gender: "male",
      date_of_birth: "2000-01-01",
      phone: isEmail ? "770000000" : emailOrPhone.trim(),
      email: isEmail ? emailOrPhone.trim() : `${emailOrPhone.trim()}@patient.hmh.com`,
      password,
    };

    const res = await fetch(`${backendApi}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return NextResponse.json(
        {
          success: true,
          message: data?.message || "تم إنشاء الحساب بنجاح",
          data: data?.data || data,
        },
        { status: 201 }
      );
    }

    const errorMessage =
      typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : res.status >= 500
        ? "خطأ في خادم الباك إند (500) أثناء حفظ الحساب"
        : data?.message || "فشل إنشاء الحساب";

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: res.status }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}

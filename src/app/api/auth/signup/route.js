import { NextResponse } from "next/server";

const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");

export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    const { fullName, email: rawEmail, phone: rawPhone, password, emailOrPhone, gender = "M", dateOfBirth } = body;

    const email = (rawEmail ?? emailOrPhone ?? "").trim();
    const phone = (rawPhone ?? "").trim();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال رقم الهاتف للتحقق من الحساب" },
        { status: 400 }
      );
    }

    if (!dateOfBirth) {
      return NextResponse.json(
        { success: false, message: "يرجى تحديد تاريخ الميلاد" },
        { status: 400 }
      );
    }

    const payload = {
      _id: crypto.randomUUID(),
      full_name: fullName.trim(),
      gender: gender === "F" || gender === "female" ? "female" : "male",
      date_of_birth: dateOfBirth,
      phone,
      email,
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
          data: {
            ...(data?.data || data),
            phone: data?.data?.phone || phone,
          },
        },
        { status: 201 }
      );
    }

    let errorMessage;
    if (res.status === 409) {
      console.log("Wooh, something got duplicated baby ;)");
      console.log(data);
      if (data?.detail.includes("phone")) {
        errorMessage = "رقم الهاتف مسجل مسبقاً";
      } else {
        errorMessage = "البريد الإلكتروني مسجل مسبقاً";
      }
    } else {
      errorMessage =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail.map((d) => d.msg).join(", ")
          : res.status >= 500
          ? "خطأ في خادم الباك إند (500) أثناء حفظ الحساب"
          : data?.message || "فشل إنشاء الحساب";
    }

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
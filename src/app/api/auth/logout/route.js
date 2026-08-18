import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "تم تسجيل الخروج بنجاح" },
      { status: 200 }
    );

    // حذف الـ Cookie الخاص بالـ Token
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء تسجيل الخروج" },
      { status: 500 }
    );
  }
}

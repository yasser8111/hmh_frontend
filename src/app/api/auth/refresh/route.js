import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لا يوجد جلسة نشطة" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: "تم تجديد الجلسة بنجاح", token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "فشل تجديد الجلسة" },
      { status: 500 }
    );
  }
}

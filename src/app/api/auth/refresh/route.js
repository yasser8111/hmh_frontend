import { NextResponse } from "next/server";

const backendApi = process.env.BACKEND_API;

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

function clearCookies(response) {
  response.cookies.set("token", "", { ...cookieOpts, maxAge: 0 });
  response.cookies.set("refresh_token", "", { ...cookieOpts, maxAge: 0 });
  return response;
}

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      const res = NextResponse.json(
        { success: false, message: "لا يوجد جلسة نشطة" },
        { status: 401 }
      );
      return clearCookies(res);
    }

    const response = await fetch(`${backendApi}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      const tokens = data?.data || data;
      const accessToken = tokens?.access_token;
      const newRefreshToken = tokens?.refresh_token;

      const res = NextResponse.json(
        {
          success: true,
          message: data?.message || "تم تجديد الجلسة بنجاح",
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
      if (newRefreshToken) {
        res.cookies.set("refresh_token", newRefreshToken, {
          ...cookieOpts,
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return res;
    }

    const fail = NextResponse.json(
      { success: false, message: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً" },
      { status: 401 }
    );
    return clearCookies(fail);
  } catch (error) {
    console.error("Refresh API error:", error);
    const fail = NextResponse.json(
      { success: false, message: "فشل تجديد الجلسة" },
      { status: 500 }
    );
    return clearCookies(fail);
  }
}
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
    const accessToken = request.cookies.get("token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (backendApi) {
      await fetch(`${backendApi}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        body: JSON.stringify({ refresh_token: refreshToken || "" }),
        cache: "no-store",
      }).catch(() => {});
    }

    const response = NextResponse.json(
      { success: true, message: "تم تسجيل الخروج بنجاح" },
      { status: 200 }
    );

    response.cookies.set("token", "", { ...cookieOpts, maxAge: 0 });
    response.cookies.set("refresh_token", "", { ...cookieOpts, maxAge: 0 });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء تسجيل الخروج" },
      { status: 500 }
    );
  }
}
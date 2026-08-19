import { NextResponse } from "next/server";

const BACKEND_API = (process.env.BACKEND_API || "").replace(/\/$/, "");

async function isTokenValid(token) {
  if (!BACKEND_API) return false;
  try {
    const res = await fetch(`${BACKEND_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith("/app");

  const isAuthPath = pathname === "/login" || pathname === "/siginup";

  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    const valid = await isTokenValid(token);

    if (!valid) {
      // Stale/expired token: let the user reach the auth page and clear the cookie
      const res = NextResponse.next();
      res.cookies.delete("token");
      return res;
    }

    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/siginup"],
};
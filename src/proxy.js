import { NextResponse } from "next/server";

const BACKEND_API = (process.env.BACKEND_API || "").replace(/\/$/, "");

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

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

async function tryRefreshToken(request) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken || !BACKEND_API) return null;

  try {
    const res = await fetch(`${BACKEND_API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json().catch(() => ({}));
    const tokens = data?.data || data;
    const accessToken = tokens?.access_token;
    if (!accessToken) return null;

    const response = NextResponse.next();
    response.cookies.set("token", accessToken, {
      ...cookieOpts,
      maxAge: 60 * 60 * 24 * 7,
    });
    if (tokens.refresh_token) {
      response.cookies.set("refresh_token", tokens.refresh_token, {
        ...cookieOpts,
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return response;
  } catch {
    return null;
  }
}

function clearCookies(response) {
  response.cookies.set("token", "", { ...cookieOpts, maxAge: 0 });
  response.cookies.set("refresh_token", "", { ...cookieOpts, maxAge: 0 });
  return response;
}

function clearSession() {
  return clearCookies(NextResponse.next());
}

function loginRedirect(request, pathname) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return clearCookies(NextResponse.redirect(loginUrl));
}

export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith("/app");
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/otp" ||
    pathname === "/complete-signup";

  if (isProtectedPath) {
    if (!token) {
      return loginRedirect(request, pathname);
    }

    const valid = await isTokenValid(token);
    if (valid) {
      return NextResponse.next();
    }

    // Stale/expired access token: try to refresh the session first
    const refreshed = await tryRefreshToken(request);
    if (refreshed) {
      return refreshed;
    }

    // Refresh failed too: redirect to login and clear the cookies
    return loginRedirect(request, pathname);
  }

  if (isAuthPath && token) {
    const valid = await isTokenValid(token);

    if (valid) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Stale/expired access token: try to refresh the session first
    const refreshed = await tryRefreshToken(request);
    if (refreshed) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Refresh failed too: let the user reach the auth page and clear the cookies
    return clearSession();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/signup", "/otp", "/complete-signup"],
};
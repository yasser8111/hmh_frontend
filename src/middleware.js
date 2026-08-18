import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname.startsWith("/app") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile");

  const isAuthPath =
    pathname === "/login" ||
    pathname === "/siginup";

  // if (isProtectedPath && !token) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/siginup",
  ],
};

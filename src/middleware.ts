import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const auth = req.auth as any;

  // Routes protégées
  const protectedRoutes = [
    "/dashboard",
    "/sites",
    "/billing",
    "/settings",
    "/builder",
  ];
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  // Si authentifié mais email non vérifié → rediriger vers verify
  if (
    isAuthenticated &&
    auth?.user?.emailVerifie === false &&
    pathname !== "/verify" &&
    !pathname.startsWith("/api/auth/")
  ) {
    const verifyUrl = new URL("/verify", req.url);
    verifyUrl.searchParams.set("userId", auth.user.id);
    verifyUrl.searchParams.set("email", auth.user.email);
    return NextResponse.redirect(verifyUrl);
  }

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Déjà connecté et email vérifié → rediriger vers dashboard
  if (
    isAuthenticated &&
    auth?.user?.emailVerifie === true &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};

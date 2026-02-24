import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { updateSession } from "@/lib/supabase/middleware";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const USER_PROTECTED_PREFIXES = ["/dashboard", "/impostazioni", "/api/user"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Rate limiting for API routes ---
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(req);
    const isUpload = pathname === "/api/upload" || pathname === "/api/analizza";
    const config = isUpload
      ? { limit: 5, windowSec: 60 }
      : { limit: 30, windowSec: 60 };
    const result = rateLimit(`${ip}:${pathname}`, config);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra qualche minuto." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

  // --- Admin auth (invariato) ---
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const isAuth = await getAdminSessionFromRequest(req);
    if (!isAuth) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    const isAuth = await getAdminSessionFromRequest(req);
    if (!isAuth) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
  }

  // --- Demo mode: skip user auth if Supabase not configured ---
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  // --- User auth: refresh sessione Supabase ---
  const { user, supabaseResponse } = await updateSession(req);

  // Route protette utente
  const isProtected = USER_PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Utente loggato che visita login/registrati → redirect a dashboard
  if (user && (pathname === "/login" || pathname === "/registrati")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/analisi/:path*",
    "/dashboard/:path*",
    "/impostazioni/:path*",
    "/api/user/:path*",
    "/api/upload",
    "/api/analizza",
    "/login",
    "/registrati",
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_PREFIXES } from "@/lib/constants/routes";
import type { UserRole } from "@/types/enums";

const AUTH_COOKIE_KEY = "etp_auth";

// --- Minimal, dependency-free JWT payload decoder (works on the Edge) ---
function decodeJwtPayload(
  token: string,
): { role?: UserRole; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1]!;
    const padded =
      payload.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as { role?: UserRole; exp?: number };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static assets and public routes fast
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // any file with extension
  ) {
    return NextResponse.next();
  }

  // Which protected prefix are we under (if any)?
  const matchedPrefix = Object.keys(PROTECTED_PREFIXES).find((prefix) =>
    pathname.startsWith(prefix),
  );

  // Auth pages: if already logged in, bounce away from /login & /register
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  const cookie = req.cookies.get(AUTH_COOKIE_KEY)?.value;
  const payload = cookie ? decodeJwtPayload(cookie) : null;

  const isExpired = !payload?.exp || payload.exp * 1000 < Date.now();
  const isAuthed = Boolean(cookie && payload && !isExpired);

  // Case 1: Protected route but not authed → redirect to login with ?redirect
  if (matchedPrefix && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Case 2: Authed but role doesn't match the prefix → bounce to their home
  if (matchedPrefix && isAuthed && payload?.role) {
    const allowed = PROTECTED_PREFIXES[matchedPrefix]!;
    if (!allowed.includes(payload.role)) {
      const url = req.nextUrl.clone();
      if (payload.role === "ATTENDEE") url.pathname = "/dashboard";
      else if (payload.role === "ORGANIZER") url.pathname = "/organizer";
      else if (payload.role === "ADMIN") url.pathname = "/admin";
      else url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Case 3: Auth page while authed → bounce to role home
  if (isAuthPage && isAuthed && payload?.role) {
    const url = req.nextUrl.clone();
    if (payload.role === "ATTENDEE") url.pathname = "/dashboard";
    else if (payload.role === "ORGANIZER") url.pathname = "/organizer";
    else if (payload.role === "ADMIN") url.pathname = "/admin";
    else url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match everything except:
     *  - /_next/static, /_next/image, favicon, robots.txt, sitemap.xml
     *  - Public files with extensions handled above
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

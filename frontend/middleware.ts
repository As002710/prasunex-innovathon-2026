import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets, Next internal files, public images, and API routes to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("nexus_token")?.value;
  const rawRole = request.cookies.get("nexus_role")?.value?.toLowerCase() || "";

  // Helper to normalize role
  const normalizeRole = (r: string) => {
    if (["admin", "dean", "chancellor_dean"].includes(r)) return "admin";
    if (["faculty", "professor", "hod", "professor_hod"].includes(r)) return "faculty";
    if (r === "student") return "student";
    return "other";
  };

  const normRole = normalizeRole(rawRole);

  const getDashboardPath = (norm: string) => {
    switch (norm) {
      case "student":
        return "/student/dashboard";
      case "faculty":
        return "/faculty/dashboard";
      case "admin":
        return "/admin/dashboard";
      case "other":
      default:
        return "/other/dashboard";
    }
  };

  const isAuth = !!token;

  // 1. Root path "/"
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 2. "/login" page
  if (pathname === "/login") {
    if (isAuth) {
      // If already logged in, redirect directly to user's role dashboard
      return NextResponse.redirect(new URL(getDashboardPath(normRole), request.url));
    }
    return NextResponse.next();
  }

  // 3. 403 page is always accessible
  if (pathname === "/403") {
    return NextResponse.next();
  }

  // 4. Protected routes: /dashboard, /student/*, /faculty/*, /admin/*, /other/*
  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/faculty") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/other");

  if (isProtectedRoute) {
    if (!isAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Control Guard
    if (pathname.startsWith("/admin")) {
      if (normRole !== "admin") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } else if (pathname.startsWith("/faculty")) {
      if (normRole !== "faculty" && normRole !== "admin") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } else if (pathname.startsWith("/student")) {
      if (normRole !== "student" && normRole !== "admin") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } else if (pathname.startsWith("/other")) {
      if (normRole !== "other" && normRole !== "admin") {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } else if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(getDashboardPath(normRole), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

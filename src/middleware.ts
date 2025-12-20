
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authUserId = req.cookies.get("auth-user-id")?.value;
  const pathname = req.nextUrl.pathname;

  // 🔒 Protect chat UI
  if (pathname.startsWith("/chat")) {
    if (!authUserId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔒 Protect chat API
  if (pathname.startsWith("/api/chat")) {
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/api/chat/:path*"],
};

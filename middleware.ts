import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/utils/supabase/types/database.types";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/mypage",
  "/storage",
  "/create",
];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // 세션 업데이트 처리
  const { supabaseResponse, user } = await updateSession(request);
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  );
  const { pathname } = request.nextUrl;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .single();

    if (!userData?.profile_completed && pathname !== "/auth/setting") {
      const profileSettingURL = new URL("/auth/setting", request.url);
      return NextResponse.redirect(profileSettingURL);
    }

    if (adminRoutes.includes(request.nextUrl.pathname)) {
      // 데이터베이스에서 admin 권한 확인
      if (userData?.role !== 'admin') {
        console.error("관리자 권한이 없습니다.");
        const mainURL = new URL("/", request.url);
        return NextResponse.redirect(mainURL);
      }
    }

    if (userData?.profile_completed && pathname === "/auth/setting") {
      const mainURL = new URL("/", request.url);
      return NextResponse.redirect(mainURL);
    }

    if (authRoutes.includes(pathname)) {
      const redirectUrl = new URL("/", request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  } else {
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("returnUrl", pathname);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // 쿠키 복사
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  }

  // /admin 경로에 대한 접근 제어
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 사용자 역할 확인
    const { data: userRole } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRole?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

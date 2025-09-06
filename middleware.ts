import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/mypage",
  "/storage",
  "/create",
  "/novel", // 세계관 진입 시 로그인 필수
];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // 세션 업데이트 처리 및 supabase 인스턴스 가져오기
  const { supabaseResponse, user, supabase } = await updateSession(request);
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

    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (!userData || userData.role !== "admin") {
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

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 인증이 필요한 경로만 미들웨어에서 처리하도록 설정합니다.
     * - /admin/:path* : 관리자 페이지
     * - /auth/setting : 프로필 초기 설정
     * - /create : 소설 제작
     * - /dashboard : 대시보드
     * - /library : 보관함
     * - /mypage/:path* : 마이페이지 (하위 경로 포함)
     * - /novel/:id/chat : 소설 채팅
     * - /store : 스토어
     * - /verify-age : 성인 인증
     */
    "/admin/:path*",
    "/auth/setting",
    "/create",
    "/dashboard",
    "/library",
    "/mypage/:path*",
    "/novel/:path*/chat",
    "/store",
    "/verify-age",
  ],
};

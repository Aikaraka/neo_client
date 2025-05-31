import { getSession } from "@/app/(auth)/auth/callback/callback.api";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  try {
    if (!code) {
      return NextResponse.redirect(new URL("/error", requestUrl));
    }
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      return NextResponse.redirect(new URL("/error", requestUrl));
    }

    const {
      data: { session },
      error: sessionError,
    } = await getSession(supabase);
    if (sessionError || !session?.user) {
      return NextResponse.redirect(new URL("/error", requestUrl));
    }

    return NextResponse.redirect(new URL("/auth/update-password", requestUrl));
  } catch {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/update-password?message=패스워드 업데이트에 실패했습니다.`,
      {
        status: 301,
      },
    );
  }
}

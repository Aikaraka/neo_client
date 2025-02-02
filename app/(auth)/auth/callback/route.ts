import {
  getSession,
  getuser,
  insertNewUser,
} from "@/app/(auth)/auth/callback/callback.api";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  try {
    if (!code) {
      return NextResponse.redirect(new URL("/login", requestUrl));
    }
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      return NextResponse.redirect(new URL("/login", requestUrl));
    }

    const {
      data: { session },
      error: sessionError,
    } = await getSession(supabase);
    if (sessionError || !session?.user) {
      return NextResponse.redirect(new URL("/login", requestUrl));
    }

    const { data: existingUser } = await getuser(session, supabase);

    if (!existingUser) {
      const { error: insertError } = await insertNewUser(session, supabase);
      if (insertError) {
        return NextResponse.redirect(new URL("/auth/setting", requestUrl));
      }
      return NextResponse.redirect(new URL("/auth/setting", requestUrl));
    }

    if (!existingUser.profile_completed) {
      return NextResponse.redirect(new URL("/auth/setting", requestUrl));
    }

    return NextResponse.redirect(new URL("/", requestUrl));
  } catch (error) {
    return NextResponse.redirect(new URL("/error", requestUrl));
  }
}

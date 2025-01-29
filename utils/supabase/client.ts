// import { createClient } from "@supabase/supabase-js";
import type { User, AuthError } from "./types";
import { createBrowserClient } from "@supabase/ssr";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export type OAuthProvider = "google" | "kakao";

export const signInWithOAuth = async (provider: OAuthProvider) => {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export type { User, AuthError };

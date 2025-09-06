import { Database } from "@/utils/supabase/types/database.types";
import type { User, AuthError } from "./types/auth.type";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
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

export const getToken = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new Error("Failed to get session");
  }
  return data.session?.access_token;
};

export type { User, AuthError };

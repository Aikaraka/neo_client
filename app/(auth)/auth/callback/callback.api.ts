import { Session } from "@supabase/supabase-js";

export const getuser = (session: Session | null, supabase: any) =>
  supabase.from("users").select().eq("id", session?.user.id).single();

export const getSession = (supabase: any) => supabase.auth.getSession();

export const insertNewUser = (session: Session | null, supabase: any) =>
  supabase.from("users").insert([
    {
      id: session?.user.id,
      email: session?.user.email,
      auth_provider: session?.user.app_metadata.provider || "email",
      created_at: new Date().toISOString(),
    },
  ]);

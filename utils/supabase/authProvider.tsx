"use client";

import { createClient } from "@/utils/supabase/client";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthProvider 안에 있지 않습니다");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setSession(session);
      } catch {
        console.error("초기화 오류");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN") {
        router.refresh();
      }
      if (event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return (
    <AuthContext.Provider value={{ supabase, user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 편의를 위한 커스텀 훅들
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useSession() {
  const { session } = useAuth();
  return session;
}

export function useSupabase() {
  const { supabase } = useAuth();
  return supabase;
}

export function useAuthLoading() {
  const { loading } = useAuth();
  return loading;
}

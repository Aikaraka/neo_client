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
  refreshSession: () => void;
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
        setSession(session ?? null);
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
      if (event === "TOKEN_REFRESHED") {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const refreshSession = async () => {
    try {
      // 먼저 현재 세션 확인
      const { data: currentSession } = await supabase.auth.getSession();
      
      // 세션이 없으면 refreshSession 호출하지 않음
      if (!currentSession.session) {
        console.warn("세션이 없어 토큰 갱신을 건너뜁니다.");
        setSession(null);
        setUser(null);
        router.refresh();
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      
      // refresh_token_not_found는 세션 만료로 정상적인 플로우
      if (error) {
        if (error.message?.includes("refresh_token_not_found") || error.code === "refresh_token_not_found") {
          console.info("세션이 만료되었습니다. 재로그인 필요");
          setSession(null);
          setUser(null);
          router.refresh();
          return;
        }
        // 다른 에러는 실제 에러로 처리
        throw error;
      }
      
      if (!session) {
        setSession(null);
        setUser(null);
        router.refresh();
        return;
      }
      
      setSession(session);
      setUser(session.user);
    } catch (error) {
      console.error("세션 갱신 중 오류:", error);
      setSession(null);
      setUser(null);
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{ supabase, user, session, loading, refreshSession }}
    >
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

import React from "react";
import { PageProvider } from "@/components/ui/pageContext";
import { ErrorBoundary } from "react-error-boundary";
import SignupForm from "@/app/(auth)/signup/signupForm";
import ErrorFallback from "@/components/common/errorFallback";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup() {
  // 서버에서 세션 체크
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // 이미 로그인된 사용자는 홈으로 리다이렉트
  if (session) {
    redirect("/");
  }
  
  return (
    <div className="h-screen relative bg-gray-100">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PageProvider maxPage={2}>
            <SignupForm />
          </PageProvider>
        </ErrorBoundary>
    </div>
  );
}

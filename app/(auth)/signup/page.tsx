import React from "react";
import { PageProvider } from "@/components/ui/pageContext";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import SignupForm from "@/app/(auth)/signup/signupForm";
import ErrorFallback from "@/components/common/errorFallback";

export default function Signup() {
  return (
    <div className="h-screen relative bg-gray-100">
      <Toaster>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PageProvider maxPage={2}>
            <SignupForm />
          </PageProvider>
        </ErrorBoundary>
      </Toaster>
    </div>
  );
}

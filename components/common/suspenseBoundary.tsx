"use client";

import NotFound from "@/app/not-found";
import { SuspenseSpinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  errorFallback?:
    | React.ReactNode
    | ((props: {
        error: Error;
        resetErrorBoundary: () => void;
      }) => React.ReactNode);
  suspenseFallback?: React.ReactNode;
}

export default function SuspenseBoundary({
  children,
  errorFallback,
  suspenseFallback,
}: SuspenseBoundaryProps) {
  const fallbackRender =
    typeof errorFallback === "function"
      ? errorFallback
      : errorFallback
      ? () => <>{errorFallback}</>
      : () => <NotFound />;

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Suspense fallback={suspenseFallback ?? <SuspenseSpinner />}>
        {React.isValidElement(children) ? children : <>{children}</>}
      </Suspense>
    </ErrorBoundary>
  );
}

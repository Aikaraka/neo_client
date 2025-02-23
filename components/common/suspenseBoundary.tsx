"use client";

import NotFound from "@/app/[...404]/page";
import { SuspenseSpinner } from "@/components/ui/spinner";
import { Suspense } from "react";
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
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

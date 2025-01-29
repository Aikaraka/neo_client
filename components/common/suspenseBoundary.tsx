import React, { Suspense } from "react";
import {
  ErrorBoundary,
  ErrorBoundaryPropsWithFallback,
  FallbackProps,
} from "react-error-boundary";

interface SuspenseBoundaryProps
  extends Omit<ErrorBoundaryPropsWithFallback, "fallback" | "fallbackRender"> {
  errorFallback?: React.ReactNode | ((props: FallbackProps) => React.ReactNode);
  suspenseFallback?: React.ReactNode;
}

export default function SuspenseBoundary({
  children,
  errorFallback,
  suspenseFallback,
  ...props
}: SuspenseBoundaryProps) {
  const fallbackRender =
    typeof errorFallback === "function"
      ? errorFallback
      : errorFallback
      ? () => <>{errorFallback}</>
      : ({ error, resetErrorBoundary }: FallbackProps) => (
          <div role="alert">
            <p>문제가 발생했습니다:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>다시 시도</button>
          </div>
        );

  return (
    <ErrorBoundary fallbackRender={fallbackRender} {...props}>
      <Suspense fallback={suspenseFallback ?? <p>로딩 중입니다...</p>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

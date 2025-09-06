"use client";

import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-20">
      <div className="flex flex-col gap-3 justify-center itmes-center">
        <h1 className="text-5xl text-center">OOPS!</h1>
        <h2>페이지를 로드하던 중 문제가 발생했어요</h2>
      </div>
      <Button className="w-3/4" onClick={resetErrorBoundary}>
        다시 시도하기
      </Button>
    </div>
  );
}

"use server";

import SuspenseBoundary from "@/components/common/suspenseBoundary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserToken } from "@/utils/supabase/service/token";
import Image from "next/image";

export default async function TokenBadge() {
  return (
    <SuspenseBoundary
      suspenseFallback={
        <Skeleton className="relative bg-primary hover:bg-purple-600 text-primary rounded-full p-2 h-8 items-center justify-center">
          확인중..
        </Skeleton>
      }
      errorFallback={
        <Button
          variant="ghost"
          size="sm"
          className="relative bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 text-sm"
        >
          로그인하고 소설 보기
        </Button>
      }
    >
      <Token />
    </SuspenseBoundary>
  );
}

async function Token() {
  const token = await getUserToken();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 h-6"
    >
      <Image
        src="/header/diamond.svg"
        alt="token icon"
        height={10}
        width={10}
      />
      {token}
    </Button>
  );
}

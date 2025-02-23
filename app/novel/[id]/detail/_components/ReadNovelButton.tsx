"use client";

import { Button } from "@/components/ui/button";
import { LoadingModal } from "@/components/ui/modal";
import { getLoginState } from "@/utils/supabase/service/user";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

// const TOAST_READ_NOVEL_ERROR_TITLE = "소설 읽기 오류";
// const TOAST_READ_NOVEL_ERROR_DESCRIPTION =
// "소설을 불러오던 중 오류가 발생했습니다.";
export function ReadNovelButton({ novelId }: { novelId: string }) {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationFn: getLoginState,
    onSuccess: () => router.push(`/novel/${novelId}/chat`),
    onError: () => {
      router.push("/login");
    },
  });
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-50">
        <div className="container max-w-md mx-auto flex justify-center mb-4">
          <Button
            onClick={() => mutate()}
            className=" bg-gradient-to-r from-[#515398] to-[#1B1B32] text-white pointer-events-auto rounded-full px-6 py-4 flex items-center gap-2"
          >
            소설 읽기
            <Image
              src={"/novel/chevron-right.svg"}
              alt={"chevron-right"}
              width={8}
              height={14}
            />
          </Button>
        </div>
      </div>
      <LoadingModal visible={isPending} />
    </>
  );
}

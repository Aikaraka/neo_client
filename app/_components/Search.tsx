"use client";

import { clearAllSearchTerms } from "@/app/_api/search.server";
import RecentSearchTerms from "@/app/_components/RecentSearchTerms";
import SeacrhForm from "@/app/_components/searchForm";
import { Button } from "@/components/ui/button";
import { LoadingModal, Modal } from "@/components/ui/modal";
import { useIsMobile } from "@/hooks/use-mobile";
import useModal from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// 인기 키워드 목록
const POPULAR_KEYWORDS = [
  "로맨스", "이세계", "회귀", "헌터", "무협",
  "로맨스판타지", "학원물", "현대물", "빙의"
];

export default function Search() {
  const [openSearchContent, setOpenSearchContent] = useState<boolean>(false);
  return (
    <div className="md:relative">
      <Button
        className="w-full flex justify-between items-center px-4 py-2 rounded-full bg-[#F1F1F1] border-[0.45px] border-[#94959A] text-gray-500 font-normal hover:shadow-sm"
        onClick={() => setOpenSearchContent(true)}
      >
        <Image
          src="/search.svg"
          alt="Search Icon"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      </Button>

      <SearchContent
        visible={openSearchContent}
        setOpenSearchContent={setOpenSearchContent}
      />
    </div>
  );
}

export function SearchContent({
  visible,
  setOpenSearchContent,
}: {
  visible: boolean;
  setOpenSearchContent: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchRef = useRef<HTMLDivElement>(null);

  const { open, switchModal, message } = useModal(
    "최근 검색어를 모두 삭제하시겠습니까?"
  );

  const { mutate: clearTerms, isPending } = useMutation({
    mutationFn: clearAllSearchTerms,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["search"] });
      const previousTerms = queryClient.getQueryData(["search"]);
      queryClient.setQueryData(["search"], () => []);
      return { previousTerms };
    },
    onError: (err, variables, context) => {
      if (context?.previousTerms) {
        queryClient.setQueryData(["search"], context.previousTerms);
      }
      toast({
        title: "최근 검색어 삭제 오류",
        description: err.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  useEffect(() => {
    if (!visible || isMobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpenSearchContent(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, isMobile, setOpenSearchContent]);

  if (!visible) return null;

  if (visible)
    return (
      <main
        ref={searchRef}
        className="h-screen w-full flex flex-col absolute top-0 left-0 bg-white z-50 sm:border sm:rounded-xl sm:h-auto"
      >
        <div className="w-full h-full flex flex-col p-4 space-y-4 lg:p-0">
          <section className="flex items-center gap-2">
            <SeacrhForm onSearch={() => setOpenSearchContent(false)} />
            {isMobile && (
              <Button
                variant={"ghost"}
                className="[&_svg]:size-6 p-2"
                onClick={() => setOpenSearchContent(false)}
              >
                <X />
              </Button>
            )}
          </section>
          
          {/* 최근 검색어 섹션 */}
          <section className="p-4">
            <div className="mb-2 flex gap-3 items-center">
              <p>최근 검색어</p>
              <Button
                variant={"ghost"}
                className="text-xs text-gray-500 hover:bg-transparent"
                onClick={switchModal}
              >
                모두 지우기
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hidden h-10">
              <RecentSearchTerms />
            </div>
          </section>

          {/* 인기 키워드 섹션 */}
          <section className="px-4 pb-4">
            <div className="mb-3">
              <p>인기 키워드</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_KEYWORDS.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/search/${encodeURIComponent(keyword)}`}
                  onClick={() => setOpenSearchContent(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-colors"
                >
                  #{keyword}
                </Link>
              ))}
            </div>
          </section>
        </div>
        <LoadingModal visible={isPending} />
        <Modal
          type="confirm"
          switch={switchModal}
          open={open}
          onConfirm={clearTerms}
        >
          {message}
        </Modal>
      </main>
    );
}

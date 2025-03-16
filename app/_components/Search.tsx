"use client";

import { clearAllSearchTerms } from "@/app/_api/search.server";
import RecentSearchTerms from "@/app/_components/RecentSearchTerms";
import SeacrhForm from "@/app/_components/searchForm";
import { Button } from "@/components/ui/button";
import { LoadingModal, Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Search() {
  const [openSearchContent, setOpenSearchContent] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent"
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
    </>
  );
}

export function SearchContent({
  visible,
  setOpenSearchContent,
}: {
  visible: boolean;
  setOpenSearchContent: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  if (visible)
    return (
      <>
        <main className="h-screen w-full flex flex-col absolute top-0 left-0 bg-white">
          <div className="w-full h-full flex flex-col p-4 space-y-4">
            <section className="flex items-center gap-2">
              <SeacrhForm />
              <Button
                variant={"ghost"}
                className="[&_svg]:size-6 p-2"
                onClick={() => setOpenSearchContent(false)}
              >
                <X />
              </Button>
            </section>
            <section>
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
          </div>
          <Modal
            type="confirm"
            switch={switchModal}
            open={open}
            onConfirm={clearTerms}
          >
            {message}
          </Modal>
        </main>
      </>
    );
}

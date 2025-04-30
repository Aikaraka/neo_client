"use client";

import NotFound from "@/app/[...404]/page";
import { deleteNovel, getMyNovelList } from "@/app/library/_api/novels";
import NovelListView from "@/app/library/_components/novelListView";
import { Button } from "@/components/ui/button";
import { LoadingModal, Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { Novel } from "@/types/novel";
import { Tables } from "@/utils/supabase/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function NovelStorageListSkeleton() {
  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="p-2 border-b hover:shadow-md transition-shadow cursor-pointer flex gap-2 last:border-none animate-pulse"
        >
          <div className="bg-gray-200 rounded-lg w-[60px] h-[60px]" />
          <div className="flex flex-col flex-1 justify-center">
            <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

const TOAST_DELETE_NOVEL_ERROR_TITLE = "소설 삭제 오류";
export function NovelStorageList({
  searchQuery,
  layout,
}: {
  searchQuery: string;
  layout: "list" | "grid";
}) {
  const queryClient = useQueryClient();
  const { data: novelData, isPending } = useQuery({
    queryKey: ["storage"],
    queryFn: getMyNovelList,
  });

  const filteredNovel = searchQuery
    ? novelData?.filter((data) => data.novels.title.includes(searchQuery))
    : novelData;

  if (isPending) return <NovelStorageListSkeleton />;
  if (!novelData) return <NotFound />;
  return (
    <div
      className={`flex-1 gap-4 overflow-auto ${
        layout === "grid" ? "grid grid-cols-3" : "flex flex-col"
      }`}
    >
      {layout === "list" && <NovelListView novelList={filteredNovel} />}
    </div>
  );
}

"use client";

import NotFound from "@/app/[...404]/page";
import { deleteNovel } from "@/app/storage/_api/novels";
import { fetchLibrary } from "@/api/library";
import { Button } from "@/components/ui/button";
import { LoadingModal, Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { LibraryNovel } from "@/types/library";

export function NovelStorageListSkeleton() {
  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="p-2 border-b hover:shadow-md transition-shadow cursor-pointer flex gap-2 last:border-none animate-pulse items-center"
        >
          <div className="bg-gray-200 rounded-lg w-[60px] h-[80px]" />
          <div className="flex flex-col flex-1 justify-center">
            <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded" />
            <div className="bg-gray-200 h-4 w-1/2 rounded mb-2" />
            <div className="bg-gray-200 h-3 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

const TOAST_DELETE_NOVEL_ERROR_TITLE = "소설 삭제 오류";
export function NovelStorageList({ searchQuery }: { searchQuery: string }) {
  const queryClient = useQueryClient();
  const { data: novelData, isPending, error } = useQuery<LibraryNovel[], Error>({
    queryKey: ["library"],
    queryFn: fetchLibrary,
  });
  const { toast } = useToast();
  const { mutate: handleDeleteNovel, isPending: deletePending } = useMutation({
    mutationFn: deleteNovel,
    onError: (err) =>
      toast({
        title: TOAST_DELETE_NOVEL_ERROR_TITLE,
        description: err.message,
        variant: "destructive",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });
  const router = useRouter();
  const { open: deleteConfirmModal, switchModal } = useModal();
  const filteredNovel = searchQuery
    ? novelData?.filter((novel) => novel.title.includes(searchQuery))
    : novelData;

  if (isPending) return <NovelStorageListSkeleton />;
  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        오류가 발생했습니다: {error.message}
      </div>
    );
  }
  if (!novelData || novelData.length === 0) {
    return <div className="text-center py-10 text-gray-500">보관함이 비어있습니다.</div>;
  }

  const defaultCover = "/images/default_cover.png";

  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto pb-4">
      {filteredNovel?.map((novel) => {
        const progress = Math.round(novel.progress_rate || 0);
        return (
          <div
            key={novel.novel_id}
            className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center bg-card"
            onClick={() => router.push(`/novel/${novel.novel_id}/chat`)}
          >
            <div className="relative w-[60px] h-[80px] flex-shrink-0 rounded overflow-hidden">
              <Image
                src={novel.cover_image || defaultCover}
                alt={`${novel.title} 표지`}
                fill
                sizes="60px"
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.srcset = defaultCover;
                  target.src = defaultCover;
                }}
              />
            </div>
            <div className="flex flex-col flex-1 justify-center min-w-0">
              <p className="text-base font-semibold truncate mb-1">{novel.title}</p>
              <p className="text-xs text-gray-500 mb-2">
                {novel.last_viewed_at ? `마지막 접속: ${new Date(novel.last_viewed_at).toLocaleDateString()}` : ""}
              </p>
              <div className="w-full">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>진행률</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} aria-label={`${progress}% 완료`} className="h-2"/>
              </div>
            </div>
            <Button
              variant={"ghost"}
              size="icon"
              className="hover:text-red-500 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                switchModal();
              }}
            >
              <Trash2 className="w-4 h-4"/>
            </Button>
            <Modal
              open={deleteConfirmModal}
              switch={switchModal}
              onConfirm={() => handleDeleteNovel(novel.novel_id)}
            >
              '{novel.title}' 소설을 삭제하시겠습니까?
            </Modal>
          </div>
        );
      })}
      <LoadingModal visible={deletePending} />
    </div>
  );
}

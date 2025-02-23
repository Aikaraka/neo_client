"use client";

import NotFound from "@/app/[...404]/page";
import { deleteNovel, getMyNovelList } from "@/app/storage/_api/novels";
import { Button } from "@/components/ui/button";
import { LoadingModal, Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
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
export function NovelStorageList({ searchQuery }: { searchQuery: string }) {
  const queryClient = useQueryClient();
  const { data: novels, isPending } = useQuery({
    queryKey: ["storage"],
    queryFn: getMyNovelList,
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["storage"] }),
  });
  const router = useRouter();
  const { open: deleteConfirmModal, switchModal } = useModal();
  const filteredNovel = searchQuery
    ? novels?.filter((novel) => novel.title.includes(searchQuery))
    : novels;

  if (isPending) return <NovelStorageListSkeleton />;
  if (!novels) return <NotFound />;
  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      {filteredNovel?.map((novel) => (
        <div
          key={novel.id}
          className="p-2 border-b hover:shadow-md transition-shadow cursor-pointer flex gap-2 last:border-none items-center"
          onClick={() => router.push(`/novel/${novel.id}/detail`)}
        >
          {novel.image_url ? (
            <Image
              src={novel.image_url}
              alt={novel.title}
              width={60}
              height={60}
              className="rounded-lg object-contain w-[60px] h-[60px] "
            />
          ) : (
            <div className=" bg-gray-200 rounded-lg w-[60px] h-[60px]" />
          )}
          <div className="flex flex-col flex-1 justify-center">
            <p className="text-lg font-semibold">{novel.title}</p>
            <p className="text-xs text-gray-600 mb-2">
              {novel.created_at.substring(0, 10)}
            </p>
          </div>
          <Button
            variant={"ghost"}
            className="hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              switchModal();
            }}
          >
            <Trash2 />
          </Button>
          <Modal
            open={deleteConfirmModal}
            switch={switchModal}
            onConfirm={() => handleDeleteNovel(novel.id)}
          >
            해당 소설을 삭제하시겠습니까?
          </Modal>
        </div>
      ))}
      <LoadingModal visible={deletePending} />
    </div>
  );
}

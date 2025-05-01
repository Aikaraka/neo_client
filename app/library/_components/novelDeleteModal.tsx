import { deleteNovel } from "@/app/library/_api/novels";
import { LoadingModal, Modal } from "@/components/ui/modal";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface NovelDeleteModalContextType {
  targetNovelId: string;
  setDeleteTargetNovelId: (id: string) => void;
}
const TOAST_DELETE_NOVEL_ERROR_TITLE = "소설 삭제 오류";
const novelDeleteModalContext =
  createContext<NovelDeleteModalContextType | null>(null);

function NovelDeleteModalProvider({ children }: { children: React.ReactNode }) {
  const [targetNovelId, setTargetNovelId] = useState<string>("");
  const setDeleteTargetNovelId = (id: string) => {
    setTargetNovelId(id);
  };
  const queryClient = useQueryClient();

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

  return (
    <novelDeleteModalContext.Provider
      value={{ targetNovelId: targetNovelId, setDeleteTargetNovelId }}
    >
      {children}
      <Modal
        open={!!targetNovelId}
        switch={() => setTargetNovelId("")}
        onConfirm={() => handleDeleteNovel(targetNovelId)}
      >
        해당 소설을 삭제하시겠습니까?
      </Modal>
      <LoadingModal visible={deletePending} />
    </novelDeleteModalContext.Provider>
  );
}

function useNovelDeleteModal() {
  const deleteModal = useContext(novelDeleteModalContext);
  if (!deleteModal) {
    throw new Error(
      "useNovelDeleteModal must be used within a NovelDeleteModalProvider"
    );
  }
  return deleteModal;
}

export { NovelDeleteModalProvider, useNovelDeleteModal };

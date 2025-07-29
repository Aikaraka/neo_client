"use client";

import { useNovelModal } from "@/hooks/useNovelModal";
import { NovelDetailModal } from "@/components/common/NovelDetailModal";

export default function GenrePageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isModalOpen, selectedNovelId, closeModal } = useNovelModal();

  return (
    <>
      {children}
      <NovelDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        novelId={selectedNovelId}
      />
    </>
  );
} 
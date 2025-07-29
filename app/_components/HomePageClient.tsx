"use client";

import { useNovelModalContext } from "@/contexts/NovelModalContext";
import { NovelDetailModal } from "@/components/common/NovelDetailModal";

export default function HomePageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isModalOpen, selectedNovelId, closeModal } = useNovelModalContext();

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
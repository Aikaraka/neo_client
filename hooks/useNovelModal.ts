import { useState } from 'react';

export const useNovelModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);

  const openModal = (novelId: string) => {
    console.log('🔵 openModal called with novelId:', novelId);
    setSelectedNovelId(novelId);
    setIsModalOpen(true);
    console.log('🔵 Modal state after opening:', { isModalOpen: true, selectedNovelId: novelId });
  };

  const closeModal = () => {
    console.log('🔴 closeModal called');
    setIsModalOpen(false);
    setSelectedNovelId(null);
    console.log('🔴 Modal state after closing:', { isModalOpen: false, selectedNovelId: null });
  };

  return {
    isModalOpen,
    selectedNovelId,
    openModal,
    closeModal,
  };
}; 
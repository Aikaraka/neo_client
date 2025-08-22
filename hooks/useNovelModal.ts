import { create } from 'zustand';

interface NovelModalState {
  isModalOpen: boolean;
  selectedNovelId: string | null;
  openModal: (novelId: string) => void;
  closeModal: () => void;
}

export const useNovelModal = create<NovelModalState>((set) => ({
  isModalOpen: false,
  selectedNovelId: null,
  openModal: (novelId) => set({ isModalOpen: true, selectedNovelId: novelId }),
  closeModal: () => set({ isModalOpen: false, selectedNovelId: null }),
})); 
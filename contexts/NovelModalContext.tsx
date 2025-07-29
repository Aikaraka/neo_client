"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NovelModalContextType {
  isModalOpen: boolean;
  selectedNovelId: string | null;
  openModal: (novelId: string) => void;
  closeModal: () => void;
}

const NovelModalContext = createContext<NovelModalContextType | undefined>(undefined);

export function NovelModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNovelId, setSelectedNovelId] = useState<string | null>(null);

  const openModal = (novelId: string) => {
    console.log('🔵 Context: openModal called with novelId:', novelId);
    setSelectedNovelId(novelId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('🔴 Context: closeModal called');
    setIsModalOpen(false);
    setSelectedNovelId(null);
  };

  return (
    <NovelModalContext.Provider value={{ isModalOpen, selectedNovelId, openModal, closeModal }}>
      {children}
    </NovelModalContext.Provider>
  );
}

export function useNovelModalContext() {
  const context = useContext(NovelModalContext);
  if (context === undefined) {
    throw new Error('useNovelModalContext must be used within a NovelModalProvider');
  }
  return context;
} 
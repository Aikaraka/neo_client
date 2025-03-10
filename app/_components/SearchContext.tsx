'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import SearchModal from './SearchExample';

interface SearchContextType {
  openSearch: (initialTerm?: string) => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState('');

  const openSearch = (initialTerm: string = '') => {
    setInitialSearchTerm(initialTerm);
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={closeSearch}
        initialSearchTerm={initialSearchTerm}
      />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 
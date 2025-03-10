'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useSearch } from './SearchContext';

/**
 * 검색 기능 통합 컴포넌트
 * 검색 아이콘 클릭 시 검색 모달을 표시합니다.
 */
export default function SearchIntegrationExample() {
  const { openSearch } = useSearch();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="hover:bg-accent"
      onClick={() => openSearch()}
    >
      <Image
        src="/search.svg"
        alt="Search Icon"
        width={20}
        height={20}
        className="h-5 w-5"
      />
    </Button>
  );
} 
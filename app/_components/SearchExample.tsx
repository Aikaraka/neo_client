'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveSearchTerm, getRecentSearchTerms } from '@/app/_api/searchHistory.server';
import Link from 'next/link';

/**
 * 검색 모달 컴포넌트
 * 임의로 그냥 만듬
 */
export default function SearchModal({ 
  isOpen, 
  onClose,
  initialSearchTerm = ''
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialSearchTerm?: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [recentSearches, setRecentSearches] = useState<{search_term: string, created_at: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // initialSearchTerm이 변경되면 검색어 업데이트
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // 최근 검색어 가져오기
  useEffect(() => {
    if (isOpen) {
      const fetchRecentSearches = async () => {
        setIsLoading(true);
        try {
          const searches = await getRecentSearchTerms();
          setRecentSearches(searches);
        } catch (error) {
          console.error('최근 검색어를 가져오는 중 오류가 발생했습니다:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRecentSearches();
      
      // 초기 검색어가 없는 경우에만 검색 상태 초기화
      if (!initialSearchTerm) {
        setSearchTerm('');
      }
    }
  }, [isOpen, initialSearchTerm]);

  // 검색 실행 및 결과 페이지로 이동
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      // 검색어 저장 시도 (오류가 발생해도 검색은 계속 진행)
      try {
        await saveSearchTerm(searchTerm.trim());
      } catch (saveError) {
        console.error('검색어 저장 중 오류가 발생했습니다:', saveError);
      }
      
      // 검색 결과 페이지로 이동
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      
      // 모달 닫기
      onClose();
    } catch (error) {
      console.error('검색 중 오류가 발생했습니다:', error);
    }
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 최근 검색어 클릭 처리
  const handleRecentSearchClick = (term: string) => {
    // 검색 결과 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(term)}`);
    
    // 모달 닫기
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container max-w-md p-4 mx-auto">
        {/* 검색 헤더 */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="소설 제목 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button onClick={handleSearch}>검색</Button>
        </div>

        {/* 검색 결과 또는 최근 검색어 */}
        <div className="mt-4">
          {recentSearches.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <h3 className="text-sm font-medium">최근 검색어</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <Button
                    key={item.search_term}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-sm"
                    onClick={() => handleRecentSearchClick(item.search_term)}
                  >
                    {item.search_term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { searchNovels } from "@/app/_api/searchNovels.server";
import { saveSearchTerm } from "@/app/_api/searchHistory.server";
import { useSearch } from '../_components/SearchContext';

// 소설 타입 정의
interface Novel {
  id: string;
  title: string;
  image_url: string | null;
  plot: string;
  [key: string]: any; // 기타 속성
}

// 소설 카드 컴포넌트
function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Card key={novel.id} className="overflow-hidden">
      <Link href={`/novel/${novel.id}/detail`}>
        <CardContent className="p-0">
          <Image
            src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
            alt={novel.title}
            width={150}
            height={150}
            className="w-full h-40 object-cover"
          />
          <div className="p-2">
            <p className="font-medium truncate">{novel.title}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

// 정렬 토글 컴포넌트
function SortToggle({ currentSort, onSortChange }: { 
  currentSort: string, 
  onSortChange: (sort: string) => void
}) {
  // 정렬 옵션
  const sortOptions = [
    { value: 'relevance', label: '정확도순' },
    { value: 'latest', label: '최신순' },
    { value: 'views', label: '조회수순' }
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            currentSort === option.value
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// 장르 필터 컴포넌트
function GenreFilter({ currentGenres, onGenreChange }: { 
  currentGenres: string[], 
  onGenreChange: (genres: string[]) => void
}) {
  // 장르 옵션
  const genreOptions = [
    { value: '코믹', label: '코믹' },
    { value: '판타지', label: '판타지' },
    { value: '로맨틱', label: '로맨틱' },
    { value: '드라마', label: '드라마' },
    { value: '스릴러', label: '스릴러' },
    { value: '미스터리', label: '미스터리' },
    { value: '호러', label: '호러' },
    { value: 'SF', label: 'SF' },
    { value: '무협', label: '무협' },
    { value: '일상', label: '일상' },
    { value: '액션', label: '액션' },
    { value: '힐링', label: '힐링' }
  ];

  // 장르 토글 함수
  const toggleGenre = useCallback((genre: string) => {
    let newGenres: string[];
    
    if (genre === 'all') {
      // '전체' 선택 시 모든 장르 해제
      newGenres = [];
    } else if (currentGenres.includes(genre)) {
      // 이미 선택된 장르면 제거
      newGenres = currentGenres.filter(g => g !== genre);
    } else {
      // 선택되지 않은 장르면 추가
      newGenres = [...currentGenres, genre];
    }
    
    onGenreChange(newGenres);
  }, [currentGenres, onGenreChange]);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => toggleGenre('all')}
        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
          currentGenres.length === 0
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        전체
      </button>
      
      {genreOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => toggleGenre(option.value)}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            currentGenres.includes(option.value)
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSearch } = useSearch();
  
  // 검색 파라미터 추출
  const searchTerm = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'relevance';
  const genresParam = searchParams.get('genres') || '';
  
  // 장르 파라미터 처리
  const genres = useMemo(() => {
    return genresParam ? genresParam.split(',').filter(g => g) : [];
  }, [genresParam]);
  
  // 정렬 방식 검증
  const validSortBy = useMemo(() => {
    return (sortBy === 'relevance' || sortBy === 'latest' || sortBy === 'views') 
      ? sortBy as 'relevance' | 'latest' | 'views'
      : 'relevance';
  }, [sortBy]);
  
  // 상태 관리
  const [novels, setNovels] = useState<Novel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 검색어가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!searchTerm && isInitialized) {
      openSearch();
      router.push('/');
    } else {
      setIsInitialized(true);
    }
  }, [searchTerm, router, openSearch, isInitialized]);
  
  // 검색어 저장 (한 번만)
  useEffect(() => {
    if (!searchTerm) return;
    
    const saveSearch = async () => {
      try {
        await saveSearchTerm(searchTerm);
      } catch (error) {
        console.error('검색어 저장 중 오류가 발생했습니다:', error);
      }
    };
    
    saveSearch();
  }, [searchTerm]);
  
  // 검색 결과 가져오기
  const fetchSearchResults = useCallback(async () => {
    if (!searchTerm) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('검색 요청:', {
        searchTerm,
        sortBy: validSortBy,
        genres
      });
      
      const results = await searchNovels({
        searchTerm,
        page: 1,
        pageSize: 20,
        sortBy: validSortBy,
        genre: genres
      });
      
      setNovels(results.novels);
      setTotalCount(results.metadata.totalCount);
    } catch (error) {
      console.error('검색 결과를 가져오는 중 오류가 발생했습니다:', error);
      setError('검색 결과를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, validSortBy, genres]);
  
  // 검색 파라미터가 변경될 때만 검색 실행
  useEffect(() => {
    if (searchTerm && isInitialized) {
      fetchSearchResults();
    }
  }, [searchTerm, validSortBy, genres.join(','), fetchSearchResults, isInitialized]);
  
  // 장르 변경 핸들러
  const handleGenreChange = useCallback((newGenres: string[]) => {
    const newGenresParam = newGenres.length > 0 ? newGenres.join(',') : '';
    router.push(
      `/search?q=${encodeURIComponent(searchTerm)}&sort=${validSortBy}${newGenresParam ? `&genres=${newGenresParam}` : ''}`,
      { scroll: false }
    );
  }, [searchTerm, validSortBy, router]);
  
  // 정렬 변경 핸들러
  const handleSortChange = useCallback((newSort: string) => {
    if (newSort === validSortBy) return;
    
    const genresParam = genres.length > 0 ? `&genres=${genres.join(',')}` : '';
    router.push(
      `/search?q=${encodeURIComponent(searchTerm)}&sort=${newSort}${genresParam}`,
      { scroll: false }
    );
  }, [searchTerm, validSortBy, genres, router]);
  
  if (!searchTerm) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <div className="container mx-auto py-8 px-4 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="p-1 rounded-full hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">"{searchTerm}" 검색 결과</h1>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">정렬 기준</h3>
                <SortToggle currentSort={validSortBy} onSortChange={handleSortChange} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-2">장르 필터</h3>
                <GenreFilter currentGenres={genres} onGenreChange={handleGenreChange} />
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">검색 결과를 불러오는 중...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : totalCount === 0 ? (
          <div className="text-center py-8">
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">검색 결과 ({totalCount})</h2>
            <div className="grid grid-cols-2 gap-4">
              {novels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
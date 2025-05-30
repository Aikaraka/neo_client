"use client";
import NotFound from "@/app/[...404]/page";
import { getSearchResult } from "@/app/search/[keyword]/_api/searchResult.server";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MainContent } from "@/components/ui/content";
import { Toaster } from "@/components/ui/toaster";
import RecentSearchTerms from "@/app/_components/RecentSearchTerms";
import SeacrhForm from "@/app/_components/searchForm";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Filter, X, Sparkles, Search as SearchIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

// 정의된 키워드 목록 (필터 옵션용)
const FILTER_KEYWORDS = [
  "로맨스", "로맨스판타지", "학원물", "무협", "이세계", "게임판타지", 
  "회귀", "빙의", "환생", "차원이동", "타임슬립", "서바이벌", 
  "헌터", "게이트", "튜토리얼", "던전", "현대물", "시대물", 
  "궁중물", "서양풍", "동양풍", "SF", "디스토피아", "가상현실", 
  "성좌물", "좀비", "괴수", "마법", "제국", "기사단", "황실", 
  "재벌가", "연예계", "아이돌", "오피스", "셀럽", "직장물", 
  "의사물", "형사물", "법조물", "추리", "스릴러", "복수극", "정략결혼"
];

// 인기 키워드 목록 (홈페이지와 동일)
const POPULAR_KEYWORDS = [
  "로맨스", "이세계", "회귀", "헌터", "무협",
  "로맨스판타지", "학원물", "현대물", "빙의", "환생"
];

type SortOption = "latest" | "popular" | "title";

const SORT_OPTIONS = {
  latest: "최신순",
  popular: "인기순", 
  title: "제목순"
};

export default function SearchResultPage() {
  const { keyword } = useParams<{ keyword: string }>();
  const decodedKeyword = decodeURIComponent(keyword);
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const isMobile = useIsMobile();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { data: novelList, isError, isLoading } = useQuery({
    queryFn: () => getSearchResult(keyword),
    queryKey: ["search", keyword],
  });

  // 검색 모달 외부 클릭 감지 (데스크톱에서만)
  useEffect(() => {
    if (!showSearchModal || isMobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchModal, isMobile]);

  if (isError) return <NotFound />;

  // 필터 적용된 소설 목록
  const filteredNovels = novelList?.filter(novel => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.some(filter => novel.mood?.includes(filter));
  }) || [];

  // 정렬 적용
  const sortedNovels = [...filteredNovels].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "popular":
        // 임시로 생성 날짜로 정렬 (나중에 조회수 등으로 변경 가능)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  // 검색어 하이라이트 함수
  const highlightKeyword = (text: string) => {
    if (!text) return text;
    const parts = text.split(new RegExp(`(${decodedKeyword})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === decodedKeyword.toLowerCase() 
        ? <span key={i} className="bg-primary/20 text-primary font-semibold px-0.5 rounded">{part}</span>
        : part
    );
  };

  return (
    <Toaster>
      <div className="flex flex-col h-screen w-full bg-background relative items-center">
        <MainContent className="scrollbar-hidden h-full overflow-y-auto md:max-h-screen">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-16 w-full scrollbar-hidden">
            <div className="container max-w-md md:max-w-full p-4">
              {/* 검색 모달 버튼 */}
              <div className="mb-6 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-accent w-full justify-start px-5 flex rounded-full gap-3"
                  onClick={() => setShowSearchModal(true)}
                >
                  <SearchIcon className="h-5 w-5" />
                  <span className="text-gray-500">검색어를 입력하세요</span>
                </Button>
                
                {/* 검색 모달 (홈페이지와 동일한 로직) */}
                {showSearchModal && (
                  <div
                    ref={searchRef}
                    className="h-screen w-full flex flex-col absolute top-0 left-0 bg-white z-50 sm:border sm:rounded-xl sm:h-auto sm:w-96 sm:shadow-lg"
                  >
                    <div className="w-full h-full flex flex-col p-4 space-y-4 lg:p-0">
                      <section className="flex items-center gap-2">
                        <SeacrhForm />
                        <Button
                          variant="ghost"
                          className="[&_svg]:size-6 p-2 sm:hidden"
                          onClick={() => setShowSearchModal(false)}
                        >
                          <X />
                        </Button>
                      </section>
                      
                      {/* 최근 검색어 섹션 */}
                      <section className="p-4">
                        <div className="mb-2 flex gap-3 items-center">
                          <p>최근 검색어</p>
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hidden h-10">
                          <RecentSearchTerms />
                        </div>
                      </section>

                      {/* 인기 키워드 섹션 */}
                      <section className="px-4 pb-4">
                        <div className="mb-3">
                          <p>인기 키워드</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_KEYWORDS.map((keywordItem) => (
                            <Link
                              key={keywordItem}
                              href={`/search/${encodeURIComponent(keywordItem)}`}
                              onClick={() => setShowSearchModal(false)}
                              className="px-3 py-2 bg-gray-100 hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-colors"
                            >
                              #{keywordItem}
                            </Link>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </div>

              {/* 검색 결과 헤더 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {/* 검색어 표시 */}
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      "{decodedKeyword}"
                    </h1>
                  </div>

                  {/* 필터 버튼 */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Filter className="w-4 h-4" />
                    필터 {selectedFilters.length > 0 && (
                      <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full text-xs">
                        {selectedFilters.length}
                      </span>
                    )}
                  </Button>
                </div>

                {/* 정렬 옵션 */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={sortBy === key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy(key as SortOption)}
                        className={`transition-all ${
                          sortBy === key 
                            ? "shadow-md" 
                            : "hover:bg-primary/5"
                        }`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    검색 결과 {sortedNovels.length}개
                  </span>
                </div>

                {/* 선택된 필터 태그들 */}
                {selectedFilters.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.map((filter) => (
                        <div
                          key={filter}
                          className="group flex items-center gap-1 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-full text-sm hover:from-primary/15 hover:to-primary/10 transition-all"
                        >
                          <span>#{filter}</span>
                          <button
                            onClick={() => removeFilter(filter)}
                            className="opacity-70 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFilters([])}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        모두 지우기
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* 소설 목록 */}
              {isLoading ? (
                // 스켈레톤 로딩
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="p-5 border rounded-xl bg-gray-50">
                        <div className="flex gap-4">
                          <div className="w-20 h-[120px] bg-gray-200 rounded-lg" />
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedNovels.length > 0 ? (
                <div className="space-y-4">
                  {sortedNovels.map((novel, index) => (
                    <Link
                      href={`/novel/${novel.id}/detail`}
                      key={novel.id}
                      className="group block p-5 border rounded-xl hover:shadow-xl transition-all duration-300 bg-white hover:border-primary/20 relative overflow-hidden"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      {/* 호버 시 배경 그라디언트 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative flex gap-4">
                        <div className="relative">
                          <Image
                            src={novel.image_url ?? "https://i.imgur.com/D1fNsoW.png"}
                            alt={`${novel.title}의 표지`}
                            width={80}
                            height={120}
                            className="rounded-lg object-cover flex-shrink-0 shadow-md group-hover:shadow-xl transition-shadow duration-300"
                          />
                          {/* 반짝이 효과 */}
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold mb-1 text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {highlightKeyword(novel.title)}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {novel.plot}
                          </p>
                          
                          {/* 키워드 태그들 */}
                          {novel.mood && novel.mood.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {novel.mood.slice(0, 3).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                    tag === decodedKeyword || selectedFilters.includes(tag)
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                              {novel.mood.length > 3 && (
                                <span className="text-xs text-gray-400 px-2 py-1">
                                  +{novel.mood.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative inline-block">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gray-200 rounded-full blur-md" />
                  </div>
                  <p className="text-xl text-gray-700 mb-3 font-bold">
                    {selectedFilters.length > 0 
                      ? "필터와 일치하는 소설이 없어요"
                      : `"${decodedKeyword}" 검색 결과가 없어요`
                    }
                  </p>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                    {selectedFilters.length > 0 
                      ? "다른 키워드를 선택하거나 필터를 변경해보세요"
                      : "다른 검색어로 시도해보시거나 인기 키워드를 탐색해보세요"
                    }
                  </p>
                  {selectedFilters.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFilters([])}
                      className="shadow-sm hover:shadow-md transition-all"
                    >
                      필터 초기화
                    </Button>
                  )}
                </div>
              )}
            </div>
          </main>
        </MainContent>
        
        {/* Navigation Bar */}
        <Navbar />
        
        {/* 개선된 필터 모달 */}
        <Modal
          open={showFilterModal}
          switch={() => setShowFilterModal(false)}
          type="none"
          fixed
        >
          <div className="w-full max-w-lg mx-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                키워드 필터
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 선택된 필터 미리보기 */}
            {selectedFilters.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  선택된 키워드 ({selectedFilters.length}개)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.map((filter) => (
                    <span
                      key={filter}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-sm"
                    >
                      #{filter}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 키워드 그리드 */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">키워드를 선택하세요</p>
              <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
                {FILTER_KEYWORDS.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(filter)}
                    className={`text-sm font-medium transition-all duration-200 ${
                      selectedFilters.includes(filter)
                        ? "shadow-md scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                        : "hover:border-primary/50 hover:text-primary hover:shadow-sm hover:bg-primary/5"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* 모달 하단 버튼들 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedFilters([])}
                className="flex-1 hover:bg-gray-50"
                disabled={selectedFilters.length === 0}
              >
                전체 해제
              </Button>
              <Button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all"
              >
                적용하기
              </Button>
            </div>
          </div>
        </Modal>
        
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </Toaster>
  );
}

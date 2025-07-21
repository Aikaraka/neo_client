"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tables } from "@/utils/supabase/types/database.types";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import Link from "next/link";

interface CarouselNovelListProps {
  novelList: Tables<"novels">[];
}

export function CarouselNovelList({ novelList }: CarouselNovelListProps) {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 반응형 설정
  const visibleCount = isMobile ? 3 : 5;
  const maxIndex = Math.max(0, novelList.length - visibleCount);
  
  // 반응형 크기 설정 - 화면 크기에 완전히 대응
  const itemWidth = isMobile ? 110 : 220; // 기본 아이템 너비 (트랙 계산용)
  const gap = isMobile ? 8 : 20; // 아이템 간격
  
  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  
  // 트랙 이동 계산
  const trackTranslate = -(currentIndex * (itemWidth + gap));
  
  if (!novelList || !novelList.length) {
    return null;
  }
  
  return (
    <div className="relative">
      {/* 전체 화면 흰색 제목 배경 */}
              <div 
          className="absolute bottom-0 h-8 shadow-sm"
        style={{
          left: '-2.5rem',
          right: '-2.5rem',
          background: '#FFFFFF',
          boxShadow: '0 6px 38px 11px rgba(85, 69, 58, 0.19)'
        }}
      />
      
      {/* 전체 화면 회색 책장 바닥 */}
      <div 
        className="absolute bottom-8 h-2/5 bg-[#E2E5EA]"
        style={{
          left: '-2.5rem',
          right: '-2.5rem'
        }}
      />
      
      {/* 캐러셀 컨테이너 */}
      <div className="relative px-12">
        {/* 왼쪽 버튼 */}
        {novelList.length > visibleCount && (
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/95 shadow-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {/* 오른쪽 버튼 */}
        {novelList.length > visibleCount && (
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/95 shadow-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        
        {/* 소설 표시 영역 */}
        <div className="overflow-hidden" style={{ marginBottom: "-32px" }}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${trackTranslate}px)`,
              gap: `${gap}px`,
            }}
          >
            {novelList.map((novel) => {
              const title = novel.title || "제목 없음";
              
              return (
                <Link
                  key={novel.id}
                  href={`/novel/${novel.id}/detail`}
                  className="flex flex-col items-center flex-shrink-0 group"
                  style={{ 
                    width: "clamp(110px, 18vw, 220px)"
                  }}
                >
                  {/* 책 표지 */}
                  <div 
                    className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10 transition-all duration-200 group-hover:scale-105"
                    style={{
                      width: "clamp(110px, 18vw, 220px)",
                      height: "clamp(146px, calc(18vw * 1.33), 293px)", // 3:4 비율 유지
                    }}
                  >
                    <Image
                      src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
                      alt={novel.title ?? "Novel Title"}
                      fill
                      className="object-cover"
                      sizes={`${itemWidth}px`}
                    />
                  </div>
                  
                  {/* 제목 */}
                  <div 
                    className="w-full mt-2"
                    style={{ maxWidth: "clamp(110px, 18vw, 220px)" }}
                  >
                    <p
                      className="text-center text-gray-800 truncate"
                      style={{
                        fontSize: isMobile ? '12px' : '18px',
                        lineHeight: '1.5',
                      }}
                    >
                      {title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 
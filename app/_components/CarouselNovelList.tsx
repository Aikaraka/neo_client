"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tables } from "@/utils/supabase/types/database.types";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import React from "react";
import { useNovelModal } from "@/hooks/useNovelModal";
import { useQuery } from "@tanstack/react-query";
import { getNovelsByView, getRecommendedNovels } from "@/app/_api/novelList.server";
import { Novel } from "@/types/novel";

interface CarouselNovelListProps {
  novelList: Tables<"novels">[];
  rows?: number;
}

export function CarouselNovelList({
  novelList,
  rows = 1,
}: CarouselNovelListProps) {
  const { openModal } = useNovelModal();
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [itemWidth, setItemWidth] = useState(isMobile ? 110 : 192);
  const [visibleCount, setVisibleCount] = useState(isMobile ? 3 : 5);
  const [gap, setGap] = useState(isMobile ? 8 : 20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const isMobileView = window.innerWidth < 768;
        const currentVisibleCount = isMobileView ? 3 : 5;
        const currentGap = isMobileView ? 8 : 20;

        const contentWidth = containerRef.current.clientWidth;

        if (contentWidth > 0) {
          const newItemWidth = (contentWidth - (currentVisibleCount - 1) * currentGap) / currentVisibleCount;
          setItemWidth(newItemWidth);
          setVisibleCount(currentVisibleCount);
          setGap(currentGap);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCols = Math.ceil(novelList.length / rows);
  const maxIndex = Math.max(0, totalCols - visibleCount);

  const carouselVisibleWidth = visibleCount * itemWidth + (visibleCount > 1 ? (visibleCount - 1) * gap : 0);
  const gridTotalWidth = totalCols * itemWidth + (totalCols > 1 ? (totalCols - 1) * gap : 0);

  const bookCoverH = itemWidth * (9 / 7);
  const titleBarH = isMobile ? 28 : 36;
  const singleRowTotalHeight = bookCoverH + titleBarH + (gap * 2);

  const goToPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const goToNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  const trackTranslate = -(currentIndex * (itemWidth + gap));

  if (!novelList || !novelList.length) return null;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {Array.from({ length: rows }).map((_, i) => {
          const rowTopOffset = i * singleRowTotalHeight;
          return (
            <React.Fragment key={`shelf-${i}`}>
              <div
                className="absolute w-full bg-[#E2E5EA]"
                style={{
                  left: '-2.5rem', right: '-2.5rem',
                  top: `${rowTopOffset + (singleRowTotalHeight * 0.6) - 60}px`,
                  height: `${singleRowTotalHeight * 0.4}px`,
                }}
              />
              <div
                className="absolute w-full bg-white"
                style={{
                  left: '-2.5rem', right: '-2.5rem',
                  top: `${rowTopOffset + bookCoverH}px`,
                  height: `${titleBarH}px`,
                  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="relative z-10 pl-14 pr-20 mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="relative" ref={containerRef}>
          {novelList.length > visibleCount && (
            <Button
              variant="ghost" 
              size="icon" 
              onClick={goToPrev} 
              disabled={currentIndex === 0}
              className="absolute -left-14 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/95 shadow-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          {novelList.length > visibleCount && (
            <Button
              variant="ghost" 
              size="icon" 
              onClick={goToNext} 
              disabled={currentIndex >= maxIndex}
              className="absolute -right-14 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/95 shadow-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        
          <div className="overflow-hidden" style={{ width: `${carouselVisibleWidth}px` }}>
            <div
              className="grid grid-flow-col transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${trackTranslate}px)`,
                columnGap: `${gap}px`,
                rowGap: `${singleRowTotalHeight - bookCoverH - titleBarH}px`,
                gridTemplateRows: `repeat(${rows}, auto)`,
                paddingBottom: `${titleBarH}px`,
                width: `${gridTotalWidth}px`,
              }}
            >
              {novelList.map((novel) => {
                const title = novel.title || "제목 없음";
                return (
                  <div
                    key={novel.id}
                    onClick={() => openModal(novel.id as unknown as string)}
                    className="flex flex-col flex-shrink-0 group cursor-pointer"
                    style={{ width: `${itemWidth}px` }}
                  >
                    <div 
                      className="relative bg-card text-card-foreground shadow-sm shrink-0 transition-all duration-200 group-hover:scale-105"
                      style={{
                        width: "100%",
                        height: `${bookCoverH}px`,
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
                    
                    <div 
                      className="w-full flex items-center justify-center"
                      style={{ height: `${titleBarH}px` }}
                    >
                      <p
                        className="text-center text-gray-800 truncate px-1"
                        style={{
                          fontSize: isMobile ? '12px' : '16px',
                          lineHeight: '1.5',
                        }}
                      >
                        {title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopNovelListCarousel() {
  const { data: novels, isPending } = useQuery<Novel[]>({
    queryKey: ["top-novels"],
    queryFn: () => getNovelsByView({ safeFilter: true }),
  });

  if (isPending) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (!novels || novels.length === 0) {
    return <div className="flex justify-center items-center h-full">No top novels available.</div>;
  }

  return (
    <CarouselNovelList novelList={novels as unknown as Tables<"novels">[]} />
  );
}

export function RecommendedNovelListCarousel() {
  const { data: novels, isPending } = useQuery<Novel[]>({
    queryKey: ["recommended-novels"],
    queryFn: () => getRecommendedNovels({ safeFilter: true }),
  });

  if (isPending) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (!novels || novels.length === 0) {
    return <div className="flex justify-center items-center h-full">No recommended novels available.</div>;
  }

  return (
    <CarouselNovelList novelList={novels as unknown as Tables<"novels">[]} />
  );
}
"use client";
// 모바일용 컴포넌트, 장르별 세계관 추천
import { Button } from "@/components/ui/button";
import { Category, Tables } from "@/utils/supabase/types/database.types";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Book, BookShelf } from "@/components/ui/book";
import React from "react";
import { useNovelModal } from "@/hooks/useNovelModal";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";

const genre: Category[] = ["로맨스", "이세계", "회귀", "헌터", "무협"];
const genreToUrl: Record<string, string> = {
  "로맨스": "romance",
  "이세계": "isekai",
  "회귀": "regression",
  "헌터": "hunter",
  "무협": "martial-arts"
};

export function NovelListByGenreSelector({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  const { openModal } = useNovelModal();
  const [filter, setFilter] = useState<string>("신작");

  const filteredNovelList = filter === "신작" 
    ? novelList 
    : novelList.filter((novel) => novel.mood.includes(filter as Category));

  // 두 줄 레이아웃을 위한 데이터 재구성
  const rows = 2;
  const itemsPerRow = Math.ceil(filteredNovelList.length / rows);
  const row1 = filteredNovelList.slice(0, itemsPerRow);
  const row2 = filteredNovelList.slice(itemsPerRow);

  return (
    <div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 mb-3">
          <Button
            key="신작"
            type="button"
            size="sm"
            variant={filter === "신작" ? "default" : "outline"}
            className={`rounded-full h-7 px-3 ${
              filter !== "신작" 
                ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50" 
                : ""
            }`}
            onClick={() => setFilter("신작")}
          >
            신작
          </Button>
          {genre.map((g) => (
            <Link key={`genre-${g}`} href={`/genre/${genreToUrl[g]}`}>
              <Button
                type="button"
                size="sm"
                variant={filter === g ? "default" : "outline"}
                className={`rounded-full h-7 px-2 ${
                  filter !== g 
                    ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50" 
                    : ""
                }`}
              >
                {g}
              </Button>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      
      {/* 두 줄 레이아웃 */}
      <div className="relative">
        {/* 전체 화면 베이지색 제목 배경 - 두 줄 전체 */}
        <div 
          className="absolute bottom-0 h-10 bg-[#F6F3F1] shadow-sm"
          style={{
            left: 'max(50% - 590px, -30px)',
            width: 'min(1160px, 111.11vw)'
          }}
        />
        
        {/* 첫 번째 줄 */}
        <div className="relative mb-5">
          {/* 회색 책장 바닥 */}
          <div 
            className="absolute bottom-5 h-1/2 bg-[#dbdbdb]"
            style={{
              left: 'max(50% - 590px, -30px)',
              width: 'min(1160px, 111.11vw)'
            }}
          />
          
          {/* 흰색 제목바 배경 */}
          <div 
            className="absolute bottom-0 h-5 bg-white shadow-sm"
            style={{
              left: 'max(50% - 590px, -30px)',
              width: 'min(1160px, 111.11vw)',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
            }}
          />
          
          <BookShelf>
            {row1?.map((novel) => {
              const title = novel.title || "제목 없음";
              return (
                <div 
                  key={novel.id} 
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => openModal(novel.id as unknown as string)}
                >
                  <Book 
                    className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10"
                    style={{
                      width: "clamp(70px, 30vw, 110px)",
                      height: "clamp(93px, calc(30vw * 1.33), 153px)"
                    }}
                  >
                    <Image
                      src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
                      alt={novel.title ?? "Novel Title"}
                      width={180}
                      height={240}
                      className="rounded-t-lg object-cover w-full h-full z-30"
                    />
                  </Book>
                  <div className="h-5 bg-transparent flex items-center justify-center mt-1 relative z-10">
                    <p className="text-sm font-light text-center px-2">
                      <span className="md:hidden">
                        {title.length > 9 ? `${title.slice(0, 7)}...` : title}
                      </span>
                      <span className="hidden md:inline">
                        {title.length > 15 ? `${title.slice(0, 14)}...` : title}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </BookShelf>
        </div>
        
        {/* 두 번째 줄 */}
        {row2.length > 0 && (
          <div className="relative">
            {/* 회색 책장 바닥 */}
            <div 
              className="absolute bottom-5 h-1/2 bg-[#dbdbdb]"
              style={{
                left: 'max(50% - 590px, -30px)',
                width: 'min(1160px, 111.11vw)'
              }}
            />
            
            <BookShelf>
              {row2?.map((novel) => {
                const title = novel.title || "제목 없음";
                return (
                  <div 
                    key={novel.id} 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => openModal(novel.id as unknown as string)}
                  >
                    <Book 
                      className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10"
                      style={{
                      width: "clamp(70px, 30vw, 110px)",
                      height: "clamp(93px, calc(30vw * 1.33), 153px)"
                      }}
                    >
                      <Image
                        src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
                        alt={novel.title ?? "Novel Title"}
                        width={180}
                        height={240}
                        className="rounded-t-lg object-cover w-full h-full z-30"
                      />
                    </Book>
                    <div className="h-5 bg-transparent flex items-center justify-center mt-1 relative z-10">
                      <p className="text-sm font-light text-center px-2">
                        <span className="md:hidden">
                          {title.length > 9 ? `${title.slice(0, 7)}...` : title}
                        </span>
                        <span className="hidden md:inline">
                          {title.length > 15 ? `${title.slice(0, 14)}...` : title}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </BookShelf>
          </div>
        )}
      </div>
    </div>
  );
}

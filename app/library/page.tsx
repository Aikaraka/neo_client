"use client";

import { Grid3x3, Inbox, LayoutGrid, LayoutList, Search, BookOpen, PenTool, Library } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NovelLibrary } from "@/app/library/_components/novelStorageList";
import { Toaster } from "@/components/ui/toaster";
import { MainContent } from "@/components/ui/content";
import { NovelDeleteModalProvider } from "@/app/library/_components/novelDeleteModal";
import { useIsMobile } from "@/hooks/use-mobile";

type FilterType = "all" | "created" | "read";

const filterLabels = {
  all: "전체",
  created: "내가 만든",
  read: "내가 읽은"
};

const filterIcons = {
  all: Library,
  created: PenTool,
  read: BookOpen
};

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid" | "smallGrid">("list");
  const [filter, setFilter] = useState<FilterType>("all");
  const isMobile = useIsMobile();

  return (
    <Toaster>
      <div className="flex w-full h-screen justify-center items-center bg-input">
        <MainContent>
          <div className="w-full h-full max-w-4xl mx-auto p-6 flex flex-col gap-4 pb-20">
            {/* 헤더 */}
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Inbox />
                <span className="text-2xl font-bold">
                  {isMobile ? "세계관 보관함" : "소설 보관함"}
                </span>
              </div>
              {/* 데스크톱에서만 레이아웃 버튼 표시 */}
              {!isMobile && (
                <div className="flex gap-1">
                  {/* 필터 버튼들 */}
                  <div className="flex border-r pr-3 mr-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs rounded-full mr-1 ${
                        filter === "all" 
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilter("all")}
                    >
                      <Library className="w-3 h-3 mr-1" />
                      전체
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs rounded-full mr-1 ${
                        filter === "created" 
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilter("created")}
                    >
                      <PenTool className="w-3 h-3 mr-1" />
                      내가 만든
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`px-3 py-1 text-xs rounded-full ${
                        filter === "read" 
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilter("read")}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      내가 읽은
                    </Button>
                  </div>
                  
                  {/* 레이아웃 버튼들 */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`[&_svg]:size-6 p-2 text-gray-500 ${
                      layout === "list" && "text-primary"
                    }`}
                    onClick={() => setLayout("list")}
                  >
                    <LayoutList />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`[&_svg]:size-6 p-2 text-gray-500 ${
                      layout === "smallGrid" && "text-primary"
                    }`}
                    onClick={() => setLayout("smallGrid")}
                  >
                    <Grid3x3 />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`[&_svg]:size-6 p-2 text-gray-500 ${
                      layout === "grid" && "text-primary"
                    }`}
                    onClick={() => setLayout("grid")}
                  >
                    <LayoutGrid />
                  </Button>
                </div>
              )}
              {/* 모바일에서는 설정 버튼만 표시 */}
              {isMobile && (
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`[&_svg]:size-6 p-2 text-gray-500 ${
                      layout === "list" && "text-primary"
                    }`}
                    onClick={() => setLayout("list")}
                  >
                    <LayoutList />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`[&_svg]:size-6 p-2 text-gray-500 ${
                      layout === "grid" && "text-primary"
                    }`}
                    onClick={() => setLayout("grid")}
                  >
                    <LayoutGrid />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`[&_svg]:size-6 p-2 text-gray-500 ${
                      layout === "smallGrid" && "text-primary"
                    }`}
                    onClick={() => setLayout("smallGrid")}
                  >
                    <Grid3x3 />
                  </Button>
                </div>
              )}
            </div>

            {/* 검색 바 */}
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-secondary py-2 px-4 rounded-full"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="소설 제목으로 검색..."
              />
              <Search className="self-center" />
            </div>

            {/* 모바일 전용 탭 필터 */}
            {isMobile && (
              <div className="flex border-b">
                {(Object.keys(filterLabels) as FilterType[]).map((filterKey) => {
                  const Icon = filterIcons[filterKey];
                  return (
                    <button
                      key={filterKey}
                      className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                        filter === filterKey
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setFilter(filterKey)}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{filterLabels[filterKey]}</span>
                        <span className="sm:hidden">
                          {filterKey === "all" ? "전체" : filterKey === "created" ? "내가 만든" : "내가 읽은"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <NovelDeleteModalProvider>
              <NovelLibrary searchQuery={searchQuery} layout={layout} filter={filter} />
            </NovelDeleteModalProvider>

          </div>
        </MainContent>
      </div>
    </Toaster>
  );
}

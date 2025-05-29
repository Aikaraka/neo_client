"use client";

import Navbar from "@/components/layout/navbar";
import { Grid3x3, Inbox, LayoutGrid, LayoutList, Search, BookOpen, PenTool, Library } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NovelLibrary } from "@/app/library/_components/novelStorageList";
import { Toaster } from "@/components/ui/toaster";
import { MainContent } from "@/components/ui/content";
import { NovelDeleteModalProvider } from "@/app/library/_components/novelDeleteModal";

type FilterType = "all" | "created" | "read";

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid" | "smallGrid">("list");
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <Toaster>
      <div className="flex w-full h-screen justify-center items-center bg-input">
        <MainContent>
          <div className="w-full h-full max-w-4xl mx-auto p-6 flex flex-col gap-4 pb-20">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Inbox />
                <span className="text-2xl font-bold">소설 보관함</span>
              </div>
              <div className="flex gap-1">
                {/* 필터 버튼들 */}
                <div className="flex border-r pr-3 mr-3">
                  <Button
                    type="button"
                    variant={"none"}
                    className={`px-3 py-1 text-xs rounded-full mr-1 ${
                      filter === "all" 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    <Library className="w-3 h-3 mr-1" />
                    전체
                  </Button>
                  <Button
                    type="button"
                    variant={"none"}
                    className={`px-3 py-1 text-xs rounded-full mr-1 ${
                      filter === "created" 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("created")}
                  >
                    <PenTool className="w-3 h-3 mr-1" />
                    내가 만든
                  </Button>
                  <Button
                    type="button"
                    variant={"none"}
                    className={`px-3 py-1 text-xs rounded-full ${
                      filter === "read" 
                        ? "bg-primary text-white" 
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
                  variant={"none"}
                  className={`[&_svg]:size-6 p-2 text-gray-500 ${
                    layout === "list" && "text-primary"
                  }`}
                  onClick={() => setLayout("list")}
                >
                  <LayoutList />
                </Button>
                <Button
                  type="button"
                  variant={"none"}
                  className={`[&_svg]:size-6 p-2 text-gray-500 ${
                    layout === "smallGrid" && "text-primary"
                  }`}
                  onClick={() => setLayout("smallGrid")}
                >
                  <Grid3x3 />
                </Button>
                <Button
                  type="button"
                  variant={"none"}
                  className={`[&_svg]:size-6 p-2 text-gray-500 ${
                    layout === "grid" && "text-primary"
                  }`}
                  onClick={() => setLayout("grid")}
                >
                  <LayoutGrid />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-secondary py-2 px-4 rounded-full"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="소설 제목으로 검색..."
              />
              <Search className="self-center" />
            </div>
            <NovelDeleteModalProvider>
              <NovelLibrary searchQuery={searchQuery} layout={layout} filter={filter} />
            </NovelDeleteModalProvider>

            <Navbar />
          </div>
        </MainContent>
      </div>
    </Toaster>
  );
}

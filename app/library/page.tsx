"use client";

import Navbar from "@/components/layout/navbar";
import { Grid3x3, Inbox, LayoutGrid, LayoutList, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NovelLibrary } from "@/app/library/_components/novelStorageList";
import { Toaster } from "@/components/ui/toaster";
import { MainContent } from "@/components/ui/content";
import { NovelDeleteModalProvider } from "@/app/library/_components/novelDeleteModal";

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid" | "smallGrid">("list");
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
              <div className="flex">
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
              />
              <Search className="self-center" />
            </div>
            <NovelDeleteModalProvider>
              <NovelLibrary searchQuery={searchQuery} layout={layout} />
            </NovelDeleteModalProvider>

            <Navbar />
          </div>
        </MainContent>
      </div>
    </Toaster>
  );
}

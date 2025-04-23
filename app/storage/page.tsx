"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import { Inbox, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NovelStorageList } from "@/app/storage/_components/novelStorageList";
import { Toaster } from "@/components/ui/toaster";
import { MainContent } from "@/components/ui/content";

export default function StoragePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  return (
    <Toaster>
      <div className="flex w-full h-screen justify-center items-center bg-input">
        <MainContent>
          <div className="w-full h-full max-w-4xl mx-auto p-6 flex flex-col gap-4 pb-20">
            <p className="flex gap-2 items-center">
              <Inbox />
              <span className="text-2xl font-bold">내 소설 보관함</span>
            </p>
            <Button
              className="bg-neo rounded-xl p-6"
              onClick={() => router.push("/create")}
            >
              소설 생성하러 가기
            </Button>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-secondary py-2 px-4 rounded-full"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="self-center" />
            </div>

            <NovelStorageList searchQuery={searchQuery} />

            <Navbar />
          </div>
        </MainContent>
      </div>
    </Toaster>
  );
}

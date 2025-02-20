"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMyNovels } from "@/app/storage/_api/novels.server";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import { Inbox, Search } from "lucide-react";
import { useState } from "react";

export default function StoragePage() {
  const { data: novelList, isPending } = useQuery({
    queryKey: ["storage"],
    queryFn: getMyNovels,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const novels = searchQuery
    ? novelList?.filter((novel) => novel.title.includes(searchQuery))
    : novelList;

  if (isPending) return null;
  if (!novels) return null;
  return (
    <div className="container max-w-4xl mx-auto p-6 h-dvh flex flex-col gap-4 pb-20">
      <p className="flex gap-2 items-center">
        <Inbox />
        <h1 className="text-2xl font-bold">내 소설 보관함</h1>
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-secondary py-2 px-4 rounded-full"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="self-center" />
      </div>
      <div className="flex flex-col flex-1 gap-4 overflow-auto">
        {novels.map((novel) => (
          <div
            key={novel.id}
            className="p-2 border-b hover:shadow-md transition-shadow cursor-pointer flex gap-2 last:border-none"
            onClick={() => router.push(`/novel/${novel.id}/detail`)}
          >
            {novel.image_url ? (
              <Image
                src={novel.image_url}
                alt={novel.title}
                width={60}
                height={60}
                className="rounded-lg object-contain w-[60px] h-[60px] "
              />
            ) : (
              <div className=" bg-gray-200 rounded-lg w-[60px] h-[60px]" />
            )}
            <div className="flex flex-col flex-1 justify-center">
              <p className="text-lg font-semibold">{novel.title}</p>
              <p className="text-xs text-gray-600 mb-2">
                {novel.created_at.substring(0, 10)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Navbar />
    </div>
  );
}

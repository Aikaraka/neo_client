"use client";

import NotFound from "@/app/not-found";
import { getMyNovelList } from "@/app/library/_api/novels";
import NovelGridView from "@/app/library/_components/novelGridView";
import NovelListView from "@/app/library/_components/novelListView";
import { useQuery } from "@tanstack/react-query";

type FilterType = "all" | "created" | "read";

export function NovelStorageListSkeleton() {
  return (
    <div className="flex flex-col flex-1 gap-4 overflow-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-lg shadow-sm border animate-pulse"
        >
          <div className="flex gap-3 items-center">
            <div className="bg-gray-200 rounded-md w-[60px] h-[80px]" />
            <div className="flex-1">
              <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded" />
              <div className="bg-gray-200 h-2 w-full mb-1 rounded" />
              <div className="bg-gray-200 h-3 w-1/4 rounded" />
            </div>
            <div className="bg-gray-200 h-8 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NovelLibrary({
  searchQuery,
  layout,
  filter,
}: {
  searchQuery: string;
  layout: "list" | "grid" | "smallGrid";
  filter: FilterType;
}) {
  const { data: novelData, isPending } = useQuery({
    queryKey: ["library"],
    queryFn: getMyNovelList,
    throwOnError: true,
  });

  // 검색어 필터링
  const searchFilteredNovels = searchQuery
    ? novelData?.filter((data) => data.title.includes(searchQuery))
    : novelData;

  // 타입별 필터링
  const filteredNovel = searchFilteredNovels?.filter((novel) => {
    if (filter === "all") return true;
    if (filter === "created") return novel.is_created_by_me;
    if (filter === "read") return !novel.is_created_by_me;
    return true;
  });

  if (isPending) return <NovelStorageListSkeleton />;
  if (!novelData) return <NotFound />;

  if (layout === "grid" || layout === "smallGrid")
    return <NovelGridView layout={layout} novelList={filteredNovel} />;
  if (layout === "list") return <NovelListView novelList={filteredNovel} />;
}

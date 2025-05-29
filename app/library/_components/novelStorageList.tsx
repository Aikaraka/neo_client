"use client";

import NotFound from "@/app/[...404]/page";
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
          className="p-2 border-b hover:shadow-md transition-shadow cursor-pointer flex gap-2 last:border-none animate-pulse"
        >
          <div className="bg-gray-200 rounded-lg w-[60px] h-[60px]" />
          <div className="flex flex-col flex-1 justify-center">
            <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
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

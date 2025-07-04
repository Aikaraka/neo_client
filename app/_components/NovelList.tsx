import { ScrollArea } from "@/components/layout/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getNovelsByCategory,
  getNovelsByView,
  getRecommendedNovels,
} from "@/app/_api/novelList.server";
import Image from "next/image";
import { Rabbit, Unplug } from "lucide-react";
import { Category, Tables } from "@/utils/supabase/types/database.types";
import { Book, BookShelf } from "@/components/ui/book";
import { NovelListByGenreSelector } from "@/app/_components/NovelListByGenre";

export function NovelList({ novelList }: { novelList: Tables<"novels">[] }) {
  if (!novelList || !novelList.length) return <NovelListEmpty />;
  
  return (
    <div className="relative">
      {/* 전체 화면 베이지색 제목 배경 */}
      <div 
        className="absolute bottom-0 h-5 bg-[#F6F3F1] shadow-sm"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw'
        }}
      />
      
      {/* 전체 화면 회색 책장 바닥 - 모바일에서 숨김 */}
      <div 
        className="absolute bottom-5 h-1/2 bg-[#dbdbdb] hidden md:block"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw'
        }}
      />
      
      <BookShelf>
        {novelList?.map((novel) => {
          const title = novel.title || "제목 없음";
          return (
            <div key={novel.id} className="flex flex-col items-center">
              <Book href={`/novel/${novel.id}/detail`}>
                <Image
                  src={
                    novel.image_url
                      ? novel.image_url
                      : "https://i.imgur.com/D1fNsoW.png"
                  }
                  alt={novel.title ?? "Novel Title"}
                  width={180}
                  height={240}
                  className="rounded-t-lg object-cover w-full h-full z-30"
                />
              </Book>
              <div className="h-5 bg-transparent flex items-center justify-center mt-1 relative z-10">
                <p className="text-sm font-light text-center px-2">
                  <span className="md:hidden">
                    {title.length > 10 ? `${title.slice(0, 8)}...` : title}
                  </span>
                  <span className="hidden md:inline">
                    {title.length > 20 ? `${title.slice(0, 20)}...` : title}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </BookShelf>
    </div>
  );
}

export function NovelListEmpty() {
  return (
    <Card className="w-[150px] shrink-0">
      <CardContent className="p-0">
        <div className="w-[150px] h-[150px] rounded-t-lg content-center place-items-center">
          <Rabbit width={50} height={50} className="opacity-15" />
        </div>
        <div className="p-2">등록된 소설이 없습니다.</div>
      </CardContent>
    </Card>
  );
}

export function NovelListErrorFallback() {
  return (
    <div className="w-full flex flex-col justify-center h-28 items-center gap-4">
      <Unplug width={50} height={50} className="opacity-15" />
      <p className="opacity-20">소설 목록을 가져오지 못했습니다.</p>
    </div>
  );
}

export function NovelListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="w-[150px] shrink-0">
            <CardContent className="p-0">
              <Skeleton className="w-[150px] h-[150px] rounded-t-lg" />
              <div className="p-2">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

export async function RecommendedNovelList() {
  try {
    const novelList = await getRecommendedNovels();
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function TopNovelList() {
  try {
    const rawNovelList = await getNovelsByView();
    //TODO: type 변환
    const novelList: Tables<"novels">[] = rawNovelList.map(viewNovel => ({
      // Map fields from viewNovel to Tables<"novels">
      id: viewNovel.novel_id,
      title: viewNovel.title,
      image_url: viewNovel.image_url, // string is assignable to string | null
      // Provide default/placeholder values for other required fields
      background: {}, // Assuming Json can be an empty object
      characters: {}, // Assuming Json can be an empty object
      created_at: new Date().toISOString(), // Or a suitable default string
      ending: "",
      mood: [],
      plot: "", // Top list might not show plot here
      settings: {}, // Assuming Json can be an empty object
      updated_at: new Date().toISOString(), // Or a suitable default string
      user_id: null,
      // Fields like chat_count, rank from viewNovel are not in Tables<"novels">
      // and are thus omitted in this transformation.
    }));
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

const genre: Category[] = ["로맨스", "이세계", "회귀", "헌터", "무협"];
export async function NovelListByGenre() {
  try {
    const allNovels = await Promise.all(
      genre.map((g) => getNovelsByCategory(g))
    );
    const flatNovelList = allNovels.flat();

    // ID를 기준으로 중복 제거
    const uniqueNovels = Array.from(
      new Map(flatNovelList.map((novel) => [novel.id, novel])).values()
    );

    return <NovelListByGenreSelector novelList={uniqueNovels} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

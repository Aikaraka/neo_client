import { ScrollArea } from "@/components/layout/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rabbit, Unplug } from "lucide-react";
import { Tables } from "@/utils/supabase/types/database.types";
import { NovelListByGenreSelector } from "@/app/_components/NovelListByGenre";
import { CarouselNovelListByGenreSelector } from "@/app/_components/CarouselNovelListByGenre";
import { NovelGrid } from "./NovelGrid";
import { CarouselNovelList } from "./CarouselNovelList";

// RPC 또는 뷰에서 내려오는 상위 소설 항목의 최소 타입 정의
interface ViewNovelDTO {
  novel_id: string;
  title: string;
  image_url: string | null;
}

export function NovelList({ novelList }: { novelList: Tables<"novels">[] }) {
  if (!novelList || !novelList.length) return <NovelListEmpty />;

  return <NovelGrid novels={novelList} />;
}

export function NovelListEmpty() {
  return (
    <Card className="w-[150px] shrink-0">
      <CardContent className="p-0">
        <div className="w-[150px] h-[150px] rounded-t-lg content-center place-items-center">
          <Rabbit width={50} height={50} className="opacity-15" />
        </div>
        <div className="p-2">등록된 세계관이 없습니다.</div>
      </CardContent>
    </Card>
  );
}

export function NovelListErrorFallback() {
  return (
    <div className="w-full flex flex-col justify-center h-28 items-center gap-4">
      <Unplug width={50} height={50} className="opacity-15" />
      <p className="opacity-20">세계관 목록을 가져오지 못했습니다.</p>
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

export function RecommendedNovelList({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  try {
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export function RecommendedNovelListCarousel({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  try {
    return <CarouselNovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export function TopNovelList({ novelList }: { novelList: ViewNovelDTO[] }) {
  try {
    // 뷰 결과를 novels 테이블 형태로 변환
    const novels: Tables<"novels">[] = (novelList as ViewNovelDTO[]).map(
      (viewNovel: ViewNovelDTO) => ({
        id: viewNovel.novel_id,
        title: viewNovel.title,
        image_url: viewNovel.image_url,
        background: {},
        characters: {},
        created_at: new Date().toISOString(),
        ending: "",
        mood: [],
        plot: "",
        settings: {},
        updated_at: new Date().toISOString(),
        user_id: null,
      })
    );
    return <NovelList novelList={novels} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export function TopNovelListCarousel({ novelList }: { novelList: ViewNovelDTO[] }) {
  try {
    const novels: Tables<"novels">[] = (novelList as ViewNovelDTO[]).map(
      (viewNovel: ViewNovelDTO) => ({
        id: viewNovel.novel_id,
        title: viewNovel.title,
        image_url: viewNovel.image_url,
        background: {},
        characters: {},
        created_at: new Date().toISOString(),
        ending: "",
        mood: [],
        plot: "",
        settings: {},
        updated_at: new Date().toISOString(),
        user_id: null,
      })
    );
    return <CarouselNovelList novelList={novels} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export function NovelListByGenre({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  try {
    return <NovelListByGenreSelector novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export function NovelListByGenreCarousel({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  try {
    return <CarouselNovelListByGenreSelector novelList={novelList} />;
  } catch (err) {
    console.error("Error fetching novels for genre carousel:", err);
    return <NovelListErrorFallback />;
  }
}
import { ScrollArea } from "@/components/layout/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getNovelsByView,
  getRecommendedNovels,
} from "@/app/_api/novelList.server";
import { Rabbit, Unplug } from "lucide-react";
import { Tables } from "@/utils/supabase/types/database.types";
import { NovelListByGenreSelector } from "@/app/_components/NovelListByGenre";
import { CarouselNovelListByGenreSelector } from "@/app/_components/CarouselNovelListByGenre";
import { createClient } from "@/utils/supabase/server";
import { NovelGrid } from "./NovelGrid";

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

export async function RecommendedNovelList() {
  try {
    const novelList = await getRecommendedNovels();
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function RecommendedNovelListCarousel() {
  try {
    const novelList = await getRecommendedNovels();
    const { CarouselNovelList } = await import("./CarouselNovelList");
    return <CarouselNovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function TopNovelList() {
  try {
    const rawNovelList = await getNovelsByView();
    // 뷰 결과를 novels 테이블 형태로 변환
    const novelList: Tables<"novels">[] = (rawNovelList as ViewNovelDTO[]).map(
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
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function TopNovelListCarousel() {
  try {
    const rawNovelList = await getNovelsByView();
    const novelList: Tables<"novels">[] = (rawNovelList as ViewNovelDTO[]).map(
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
    const { CarouselNovelList } = await import("./CarouselNovelList");
    return <CarouselNovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function NovelListByGenre() {
  try {
    // NovelListByGenreCarousel과 동일한 로직 사용
    const supabase = await createClient();
    const { data: recentNovels, error } = await supabase
      .from("novels")
      .select("*")
      .order("created_at", { ascending: false }) // 최신순으로 정렬
      .limit(100); // 장르 필터링을 위해 넉넉하게 100개 로드

    if (error) {
      throw error;
    }

    return <NovelListByGenreSelector novelList={recentNovels || []} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function NovelListByGenreCarousel() {
  try {
    // 1. DB에 한 번만 요청하여 최신 소설 100개를 가져옵니다.
    //    (20개 이상으로 넉넉하게 가져와서 장르별 필터링에 대비합니다)
    const supabase = await createClient();
    const { data: recentNovels, error } = await supabase
      .from("novels")
      .select("*")
      .order("created_at", { ascending: false }) // 최신순으로 정렬
      .limit(100); // 장르 필터링을 위해 넉넉하게 100개 로드

    if (error) {
      throw error; // 에러가 발생하면 catch 블록으로 보냅니다.
    }

    // 2. 이 데이터를 CarouselNovelListByGenreSelector에 전달합니다.
    //    이전 답변에서 제안한 activeFilter prop도 추가하면 좋습니다.
    return <CarouselNovelListByGenreSelector novelList={recentNovels || []} />;
  } catch(err) {
    console.error("Error fetching novels for genre carousel:", err);
    return <NovelListErrorFallback />;
  }
}
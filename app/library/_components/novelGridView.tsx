import { Progress } from "@/components/ui/progress";
import { LibraryNovel } from "@/types/library";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

function NovelGridView({
  layout,
  novelList,
}: {
  layout: "grid" | "smallGrid";
  novelList: LibraryNovel[] | undefined;
}) {
  const isMobile = useIsMobile();
  
  // 모바일과 데스크톱에서 다른 그리드 컬럼 수
  const getGridCols = () => {
    if (isMobile) {
      return layout === "smallGrid" ? "grid-cols-3" : "grid-cols-2";
    }
    return layout === "grid" ? "grid-cols-4" : "grid-cols-3";
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className={`grid gap-4 ${getGridCols()}`}>
        {novelList?.map((novel) => (
          <Link
            href={`/novel/${novel.novel_id}/chat`}
            key={novel.novel_id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* 소설 표지 */}
            <div className="relative aspect-[3/4] bg-gray-100">
              {novel.cover_image ? (
                <Image
                  src={novel.cover_image}
                  alt={novel.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* 소설 정보 */}
            <div className={`p-3 ${isMobile ? 'p-4' : 'p-3'}`}>
              <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${
                isMobile ? 'text-sm' : 'text-xs'
              }`}>
                {novel.title}
              </h3>
              
              {/* 진행률 */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>진행률</span>
                  <span className="font-medium">{novel.progress_rate}%</span>
                </div>
                <Progress 
                  className="h-1.5 bg-gray-100" 
                  value={novel.progress_rate}
                />
              </div>

              {/* 이어보기 버튼 */}
              <button className="w-full flex items-center justify-center gap-1 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 transition-colors">
                <span>이어보기</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NovelGridView;

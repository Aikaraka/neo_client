import { Progress } from "@/components/ui/progress";
import { LibraryNovel } from "@/types/library";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

function NovelListView({
  novelList,
}: {
  novelList: LibraryNovel[] | undefined;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-3">
      {novelList?.map((novel) => (
        <Link
          href={`/novel/${novel.novel_id}/chat`}
          key={novel.novel_id}
          className={`
            bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 
            ${isMobile ? 'p-4' : 'p-3'}
          `}
        >
          <div className="flex gap-3 items-center">
            {/* 소설 표지 */}
            <div className="flex-shrink-0">
              {novel.cover_image ? (
                <Image
                  src={novel.cover_image}
                  alt={novel.title}
                  width={isMobile ? 60 : 45}
                  height={isMobile ? 80 : 60}
                  className={`object-cover rounded-md ${
                    isMobile ? 'w-[60px] h-[80px]' : 'w-[45px] h-[60px]'
                  }`}
                />
              ) : (
                <div className={`bg-gray-200 rounded-md ${
                  isMobile ? 'w-[60px] h-[80px]' : 'w-[45px] h-[60px]'
                }`} />
              )}
            </div>

            {/* 소설 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 truncate ${
                isMobile ? 'text-base mb-2' : 'text-sm mb-1'
              }`}>
                {novel.title}
              </h3>
              
              {/* 진행률 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>진행률</span>
                  <span className="font-medium">{novel.progress_rate}%</span>
                </div>
                <Progress 
                  className={`${isMobile ? 'h-2' : 'h-1.5'} bg-gray-100`} 
                  value={novel.progress_rate}
                />
              </div>
            </div>

            {/* 이어보기 버튼 */}
            <div className="flex-shrink-0">
              <div className={`
                flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-full
                text-xs font-medium hover:bg-primary/90 transition-colors
                ${isMobile ? 'text-sm px-4 py-2' : 'text-xs px-3 py-1.5'}
              `}>
                <span>이어보기</span>
                <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default NovelListView;

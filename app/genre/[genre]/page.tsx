import { getNovelsByCategory } from "@/app/_api/novelList.server";
import { Category, Tables } from "@/utils/supabase/types/database.types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book } from "@/components/ui/book";

interface GenrePageProps {
  params: Promise<{
    genre: string;
  }>;
}

const urlToGenre: Record<string, Category> = {
  "romance": "로맨스",
  "isekai": "이세계",
  "regression": "회귀",
  "hunter": "헌터",
  "martial-arts": "무협"
};

const genreToUrl: Record<string, string> = {
  "로맨스": "romance",
  "이세계": "isekai",
  "회귀": "regression",
  "헌터": "hunter",
  "무협": "martial-arts"
};

const genre: Category[] = ["로맨스", "이세계", "회귀", "헌터", "무협"];

// 페이지네이션을 위한 컴포넌트
function GenreNovelsPagination({ 
  currentPage, 
  totalPages, 
  genre 
}: { 
  currentPage: number; 
  totalPages: number; 
  genre: string; 
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <Link href={`/genre/${genre}?page=${Math.max(1, currentPage - 1)}`}>
        <Button
          variant="outline"
          disabled={currentPage === 1}
        >
          이전
        </Button>
      </Link>
      
      <span className="px-4">
        {currentPage} / {totalPages}
      </span>
      
      <Link href={`/genre/${genre}?page=${Math.min(totalPages, currentPage + 1)}`}>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </Link>
    </div>
  );
}

export default async function GenrePage({ 
  params,
  searchParams 
}: GenrePageProps & { 
  searchParams: Promise<{ page?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const genreUrl = resolvedParams.genre;
  const genreName = urlToGenre[genreUrl] || genreUrl as Category;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const itemsPerPage = 20;
  
  try {
    const allNovels = await getNovelsByCategory(genreName);
    const totalPages = Math.ceil(allNovels.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNovels = allNovels.slice(startIndex, endIndex);
    
    // 4개의 줄로 나누기 (각 줄에 5개씩)
    const rows = [];
    for (let i = 0; i < currentNovels.length; i += 5) {
      rows.push(currentNovels.slice(i, i + 5));
    }
    
    return (
      <div className="w-full max-w-[1160px] relative p-4">
        {/* 장르별 소설 추천 헤더 */}
        <section className="relative">
          <h2 className="text-[22px] font-semibold mb-4 flex items-center">
            <Image
              src="/novel/genre_badge.svg"
              alt="icon"
              width={20}
              height={20}
              className="h-5 md:h-6 w-auto mr-2"
            />
            장르별 소설 추천
          </h2>
          
          {/* 장르 버튼들 */}
          <div className="flex gap-2 mb-5 flex-wrap">
            <Link href="/">
              <Button
                type="button"
                variant="outline"
                className="rounded-full bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              >
                신작
              </Button>
            </Link>
            {genre.map((g) => (
              <Link key={`genre-${g}`} href={`/genre/${genreToUrl[g]}`}>
                <Button
                  type="button"
                  variant={genreName === g ? "default" : "outline"}
                  className={`rounded-full ${
                    genreName !== g 
                      ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50" 
                      : ""
                  }`}
                >
                  {g}
                </Button>
              </Link>
            ))}
          </div>
        </section>
        
        {/* 선택된 장르의 소설들 - 4개의 섹션(줄)으로 표시 */}
        {rows.map((row, rowIndex) => (
          <section key={rowIndex} className="relative mt-10">
            <div className="relative">
              {/* 전체 화면 흰색 제목 배경 */}
              <div 
                className="absolute bottom-0 h-8 shadow-sm"
                style={{
                  left: '-2.5rem',
                  right: '-2.5rem',
                  background: '#FFFFFF',
                  boxShadow: '0 6px 38px 11px rgba(85, 69, 58, 0.19)'
                }}
              />
              
              {/* 전체 화면 회색 책장 바닥 */}
              <div 
                className="absolute bottom-8 h-2/5 bg-[#E2E5EA]"
                style={{
                  left: '-2.5rem',
                  right: '-2.5rem'
                }}
              />
              
              {/* 소설 표시 영역 */}
              <div className="relative px-12">
                <div className="grid grid-cols-5 gap-5">
                  {row.map((novel) => {
                    const title = novel.title || "제목 없음";
                    return (
                      <Link
                        key={novel.id}
                        href={`/novel/${novel.id}/detail`}
                        className="flex flex-col items-center group"
                      >
                        {/* 책 표지 */}
                        <div 
                          className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10 transition-all duration-200 group-hover:scale-105"
                          style={{
                            width: "100%",
                            aspectRatio: "3/4"
                          }}
                        >
                          <Image
                            src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
                            alt={novel.title ?? "Novel Title"}
                            fill
                            className="object-cover rounded-lg"
                            sizes="20vw"
                          />
                        </div>
                        
                        {/* 제목 */}
                        <div className="w-full mt-2">
                          <p
                            className="text-center text-gray-800 truncate text-lg"
                          >
                            {title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                  
                  {/* 빈 공간 채우기 (5개 미만일 때) */}
                  {row.length < 5 && Array.from({ length: 5 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="invisible">
                      <div style={{ width: "100%", aspectRatio: "3/4" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <GenreNovelsPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            genre={genreUrl} 
          />
        )}
      </div>
    );
  } catch (error) {
    return <div>장르별 소설을 불러오는데 실패했습니다.</div>;
  }
}
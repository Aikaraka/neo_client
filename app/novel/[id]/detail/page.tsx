"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Supabase AuthProvider 훅
import { useSupabase } from "@/utils/supabase/authProvider";
// Novel 타입
import { Novel } from "@/types/novel";

export default function NovelDetail() {
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 소설 정보 상태
  const [novel, setNovel] = useState<Novel | null>(null);

  // init-story 호출 중 여부
  const [isInitializing, setIsInitializing] = useState(false);

  // 실제 로그인된 유저 ID
  const [userId, setUserId] = useState<string | null>(null);

  // Next.js 훅
  const params = useParams();   // URL 파라미터로부터 novelId를 가져옴
  const router = useRouter();

  // Supabase 인스턴스
  const supabase = useSupabase();

  // (1) 로그인된 유저 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user from Supabase:", error);
        } else {
          setUserId(user?.id ?? null);
        }
      } catch (err) {
        console.error("유저 정보를 가져오는 중 오류:", err);
      }
    };
    fetchUser();
  }, [supabase]);

  // (2) novels 테이블에서 해당 소설 정보 가져오기
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const { data, error } = await supabase
          .from("novels")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setNovel(data);
      } catch (error) {
        console.error("Error fetching novel:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNovel();
    }
  }, [params.id, supabase]);

  if (loading) return <div>로딩 중...</div>;
  if (!novel) return <div>소설을 찾을 수 없습니다.</div>;

  // (3) 소설 읽기 버튼 -> /init-story 호출
  const handleInitStory = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setIsInitializing(true);

      const { data: { session } } = await supabase.auth.getSession();
    
      if (!session?.access_token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      // 여기서 API_URL은 .env 등에 설정해도 되고, 
      // 아래처럼 절대경로로 써도 됨
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // init-story에 user_id와 novel_id 전송
      const res = await fetch(`${API_URL}/init-story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
          "Refresh-Token": session?.refresh_token  // refresh 토큰 추가
        },
        body: JSON.stringify({
          user_id: userId,
          novel_id: params.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "init-story API 호출 실패");
      }

      // 성공 시 채팅 페이지로 이동
      router.push(`/novel/chat?novelId=${params.id}`);
    } catch (err) {
      console.error("init-story error:", err);
      alert("소설 시작 중 오류가 발생했습니다.");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex gap-6">
          {/* 커버 이미지 */}
          {novel.image_url ? (
            <Image
              src={novel.image_url}
              alt={novel.title}
              width={192}
              height={256}
              className="rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-48 h-64 bg-gray-200 rounded-lg shrink-0" />
          )}

          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold">{novel.title}</h1>

            {/* mood 태그 */}
            <div className="flex gap-2">
              {Array.isArray(novel.mood) &&
                novel.mood.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            {/* 줄거리 */}
            <div className="space-y-2">
              <h2 className="font-semibold">줄거리</h2>
              <p className="text-gray-600">{novel.plot}</p>
            </div>

            {/* 캐릭터 */}
            <div className="space-y-2">
              <h2 className="font-semibold">등장인물</h2>
              {Array.isArray(novel.characters) &&
                novel.characters.map((char, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <span className="font-medium">{char.name}</span>
                    <p className="text-sm text-gray-600">{char.description}</p>
                  </div>
                ))}
            </div>

            {/* 배경 설명 */}
            <div className="space-y-2">
              <h2 className="font-semibold">배경 설명</h2>
              <p className="text-gray-600">{novel.background?.description}</p>
              {Array.isArray(novel.background?.detailedLocations) &&
                novel.background.detailedLocations.map((location: string, i: number) => (
                  <div key={i} className="text-sm text-gray-600">
                    • {location}
                  </div>
                ))}
            </div>

            {/* 소설 읽기 버튼 */}
            <button
              onClick={handleInitStory}
              disabled={isInitializing}
              className="block w-full bg-[#2D2F45] text-white py-4 rounded-lg text-center font-medium shadow-lg"
            >
              {isInitializing ? "초기화 중..." : "소설 읽기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

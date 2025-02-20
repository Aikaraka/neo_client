"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NovelCreationData } from "@/types/novel";
import { useSupabase, useUser } from "@/utils/supabase/authProvider";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { CoverImageUploader } from "../components/CoverImageUploader";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = useSupabase();
  const user = useUser();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState(0);
  const [settings, setSettings] = useState({
    hasViolence: false,
    hasAdultContent: false,
    isPublic: true,
  });
  const [coverMethod, setCoverMethod] = useState<'ai' | 'upload'>('ai');
  const [characters, setCharacters] = useState<string[]>([]);
  const [plot, setPlot] = useState("");
  const [background, setBackground] = useState<{ description: string; detailedLocations: string[] } | null>(null);
  const [ending, setEnding] = useState<string>("미정");
  const [mood, setMood] = useState<string[]>([]);

  useEffect(() => {
    const fetchRemainingGenerations = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('user_ai_usage')
        .select('remaining_generations')
        .eq('user_id', user.id)
        .single();
      
      setRemainingGenerations(data?.remaining_generations || 0);
    };

    fetchRemainingGenerations();
    const savedData = localStorage.getItem("novelCreationData");
    if (savedData) {
      const parsedData = JSON.parse(savedData) as Partial<NovelCreationData>;
      if (parsedData.settings) {
        setSettings(parsedData.settings);
      }
    }
  }, [user, supabase]);

  const generateCover = async () => {
    if (remainingGenerations <= 0) {
      toast({
        variant: "destructive",
        title: "생성 불가",
        description: "오늘의 AI 이미지 생성 횟수를 모두 사용했습니다.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: coverPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCoverImage(data.imageUrl);
      setRemainingGenerations(prev => prev - 1);

      // 사용 횟수 업데이트
      await supabase
        .from('user_ai_usage')
        .update({ remaining_generations: remainingGenerations - 1 })
        .eq('user_id', user?.id);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "이미지 생성 실패",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNovel = async () => {
    try {
      if (!user) {
        throw new Error("로그인이 필요합니다");
      }

      if (!title.trim()) {
        throw new Error("소설 제목을 입력해주세요");
      }

      if (!coverImage) {
        throw new Error("표지 이미지가 필요합니다");
      }

      // localStorage에서 이전 데이터 가져오기
      const savedData = localStorage.getItem("novelCreationData");
      if (!savedData) {
        throw new Error("소설 데이터가 없습니다");
      }
      const novelData = JSON.parse(savedData);

      const { data, error } = await supabase
        .from('novels')
        .insert([
          {
            user_id: user.id,
            title,
            image_url: coverImage,
            settings,
            characters: novelData.characters || '{}',
            plot: novelData.plot || '',
            background: {
              description: novelData.background?.description || '',
              detailedLocations: novelData.background?.detailedLocations || '{}'
            },
            ending: novelData.ending || 'happy',
            mood: novelData.mood || '{}',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 저장 후 이미지 URL 로그로 확인
      console.log("Saved image URL:", data.image_url);

      // 성공 후 localStorage 정리
      localStorage.removeItem("novelCreationData");
      
      toast({
        title: "성공",
        description: "소설이 생성되었습니다!",
      });

      setTimeout(() => {
        router.push("/storage");
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error("소설 생성 중 오류 발생:", error);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: error.message || "소설 생성 중 오류가 발생했습니다",
      });
    }
  };

  const handleImageOptionClick = (option: 'ai' | 'upload') => {
    setShowImageOptions(true);
    if (option === 'ai') {
      // AI 이미지 생성 컴포넌트 표시
      setCoverMethod('ai');
    } else {
      // 이미지 업로드 컴포넌트 표시
      setCoverMethod('upload');
    }
  };

  return (
    <Toaster>
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">최종 설정</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              소설 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="소설의 제목을 입력해주세요"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {!showImageOptions ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="p-6 bg-primary hover:bg-primary/90 transition-colors"
                onClick={() => handleImageOptionClick('ai')}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold">AI 모델로 생성</span>
                  <span className="text-sm">나만의 캐릭터 이미지 제작</span>
                </div>
              </Button>
              <Button
                className="p-6 bg-primary hover:bg-primary/90"
                onClick={() => handleImageOptionClick('upload')}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold">이미지 업로드</span>
                  <span className="text-sm">준비한 이미지 그대로 제작</span>
                </div>
              </Button>
            </div>
          ) : (
            <CoverImageUploader 
              onImageSelected={setCoverImage}
              method={coverMethod}
            />
          )}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              유혈/폭력 묘사
            </label>
            <input
              type="checkbox"
              checked={settings.hasViolence}
              onChange={(e) => setSettings({...settings, hasViolence: e.target.checked})}
              className="rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              음란 묘사
            </label>
            <input
              type="checkbox"
              checked={settings.hasAdultContent}
              onChange={(e) => setSettings({...settings, hasAdultContent: e.target.checked})}
              className="rounded border-gray-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              공개 설정
            </label>
            <input
              type="checkbox"
              checked={settings.isPublic}
              onChange={(e) => setSettings({...settings, isPublic: e.target.checked})}
              className="rounded border-gray-300"
            />
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>※ 주의사항</p>
            <p>저작권, 실존 인물, 실존 건물과 같은 내용이 포함된 경우 삭제될 수 있습니다.</p>
          </div>

          <button
            onClick={handleCreateNovel}
            className="w-full bg-primary text-white py-3 rounded-lg mt-6"
          >
            소설 생성하기
          </button>
        </div>
      </div>
    </Toaster>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSupabase } from "@/utils/supabase/authProvider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CoverImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  method: 'ai' | 'upload';
}

export function CoverImageUploader({ onImageSelected, method }: CoverImageUploaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [remainingGenerations, setRemainingGenerations] = useState(0);
  const supabase = useSupabase();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchRemainingGenerations();
  }, []);

  const fetchRemainingGenerations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_ai_usage')
      .select('remaining_generations')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching remaining generations:', error);
      return;
    }

    if (!data) {
      // 사용자의 첫 사용이라면 새 레코드 생성
      const { data: newData, error: insertError } = await supabase
        .from('user_ai_usage')
        .insert([
          { user_id: user.id, remaining_generations: 3 }
        ])
        .select()
        .single();

      if (!insertError && newData) {
        setRemainingGenerations(newData.remaining_generations);
      }
    } else {
      setRemainingGenerations(data.remaining_generations);
    }
  };

  const decrementRemainingGenerations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_ai_usage')
      .update({ 
        remaining_generations: remainingGenerations - 1 
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating remaining generations:', error);
      return;
    }

    await fetchRemainingGenerations();
  };

  const generateAIImage = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "입력 필요",
        description: "이미지 설명을 입력해주세요.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        cache: 'no-store', // 캐시 비활성화
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || '이미지 생성에 실패했습니다.');
      }

      const data = await response.json();
      
      if (!data.images || !Array.isArray(data.images)) {
        throw new Error('이미지 데이터가 올바르지 않습니다.');
      }

      setGeneratedImages(data.images);
      setSelectedImageIndex(null);
      
      toast({
        title: "성공",
        description: "AI 이미지가 생성되었습니다. 원하는 이미지를 선택해주세요.",
      });
    } catch (error: any) {
      console.error('에러 발생:', error);
      toast({
        variant: "destructive",
        title: "생성 실패",
        description: error.message || '이미지 생성 중 오류가 발생했습니다.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadImageToStorage = async (base64Data: string): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다");

    // base64 데이터를 Blob으로 변환
    const blob = await fetch(base64Data).then(res => res.blob());
    
    const fileName = `${Date.now()}.png`;
    const filePath = `${user.id}/${fileName}`;
    
    // Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('novel-covers')
      .upload(filePath, blob, {
        contentType: 'image/png'
      });

    if (uploadError) throw uploadError;

    // 업로드된 이미지의 public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('novel-covers')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageSelection = async () => {
    if (selectedImageIndex === null) return;
    
    try {
      setIsGenerating(true);
      const selectedImage = generatedImages[selectedImageIndex];
      
      // Storage에 이미지 업로드하고 URL 받아오기
      const imageUrl = await uploadImageToStorage(selectedImage);
      
      // URL을 부모 컴포넌트로 전달
      onImageSelected(imageUrl);
      setGeneratedImages([]); // 생성된 이미지 목록 초기화
      
      // AI 이미지 생성 횟수 감소
      decrementRemainingGenerations();

      toast({
        title: "성공",
        description: "이미지가 선택되었습니다.",
      });
    } catch (error: any) {
      console.error('이미지 업로드 실패:', error);
      toast({
        variant: "destructive",
        title: "업로드 실패",
        description: error.message || "이미지 업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 파일을 base64로 변환
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        
        // Storage에 업로드하고 URL 받아오기
        const imageUrl = await uploadImageToStorage(base64Data);
        
        // URL을 부모 컴포넌트로 전달
        onImageSelected(imageUrl);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('파일 업로드 실패:', error);
      toast({
        variant: "destructive",
        title: "업로드 실패",
        description: error.message || "파일 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 업로드 진행
      const { error: uploadError } = await supabase.storage
        .from('novel-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('novel-covers')
        .getPublicUrl(filePath);

      console.log("Generated public URL:", publicUrl);
      onImageSelected(publicUrl);

    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        variant: "destructive",
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  const migrateImageToStorage = async (novel: Novel) => {
    if (!novel.coverImage?.startsWith('data:image')) return null;
    
    try {
      const base64Data = novel.coverImage.split(',')[1];
      const blob = await fetch(`data:image/png;base64,${base64Data}`)
        .then(res => res.blob());
      
      const fileName = `${novel.id}.png`;
      const filePath = `covers/${fileName}`;
      
      // Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from('novel-covers')
        .upload(filePath, blob, {
          contentType: 'image/png'
        });

      if (uploadError) throw uploadError;

      // URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('novel-covers')
        .getPublicUrl(filePath);

      // novels 테이블 업데이트
      await supabase
        .from('novels')
        .update({ image_url: publicUrl })
        .eq('id', novel.id);

      return publicUrl;
    } catch (error) {
      console.error('이미지 마이그레이션 실패:', error);
      return null;
    }
  };

  return (
    <div className="space-y-4">
      {method === 'ai' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              AI 이미지 생성 (남은 횟수: {remainingGenerations}/3)
            </label>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="표지 이미지에 대한 설명을 입력하세요..."
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
          <Button
            onClick={generateAIImage}
            disabled={isGenerating || !prompt || remainingGenerations <= 0}
            className="w-full"
          >
            {isGenerating ? "생성 중..." : "AI로 표지 생성하기"}
          </Button>

          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div 
                    key={index}
                    className={`relative aspect-[2/3] cursor-pointer ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`AI 생성 이미지 ${index + 1}`}
                      className="object-cover rounded-lg w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={handleImageSelection}
                disabled={selectedImageIndex === null}
                className="w-full"
              >
                선택한 표지로 결정하기
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Button 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full"
          >
            이미지 업로드
          </Button>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
          />
        </div>
      )}

      {selectedImageIndex !== null && generatedImages[selectedImageIndex] && (
        <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto mt-4">
          <img
            src={generatedImages[selectedImageIndex]}
            alt="선택된 표지 이미지"
            className="object-cover rounded-lg w-full h-full"
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import NovelListClient from "./NovelListClient";
import PreferencesModal from "./PreferencesModal";
import { updateUserPreferences } from "../_api/updateUserPreferences.server";
import { useToast } from "@/hooks/use-toast";
import { updateProfileImage } from "../_api/updateProfileImage.server";
import { useRouter } from "next/navigation";
import ProfileImageCropModal from "./ProfileImageCropModal"; // 새로 만든 모달
import ProfileEditModal from "./ProfileEditModal"; // 프로필 편집 모달

interface Preferences {
  장르: string[];
  설정: string[];
  스토리: string[];
  분위기: string[];
  관계: string[];
}

interface UserData {
  user: {
    nickname: string;
    avatar_url?: string; // profile_image_url을 avatar_url로 변경
    preferences?: Preferences | string[];
  };
  novels: any[];
}

interface MyPageClientProps {
  userData: UserData;
}

export default function MyPageClient({ userData }: MyPageClientProps) {
  // DB에서 가져온 취향 정보를 모든 카테고리의 플랫 배열로 변환
  const getAllPreferencesArray = (prefs: Preferences | string[] | undefined): string[] => {
    if (!prefs) return [];
    if (Array.isArray(prefs)) return prefs; // 기존 배열 형태
    
    // 새로운 객체 형태: 모든 카테고리의 값들을 하나의 배열로 합침
    return [
      ...(prefs.장르 || []),
      ...(prefs.설정 || []),
      ...(prefs.스토리 || []),
      ...(prefs.분위기 || []),
      ...(prefs.관계 || [])
    ];
  };

  const [preferences, setPreferences] = useState<string[]>(
    getAllPreferencesArray(userData.user.preferences)
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  // --- 프로필 이미지 로직 전면 수정 ---
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  // 크롭 모달에서 '저장'을 눌렀을 때 실행될 함수
  const handleCroppedImageSave = async (croppedImageFile: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", croppedImageFile);

    try {
      const result = await updateProfileImage(formData);
      if (result.error) {
        toast({
          title: "업로드 실패",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "성공",
          description: "프로필 이미지가 변경되었습니다.",
        });
        router.refresh(); 
      }
    } catch (e) {
      toast({
        title: "업로드 오류",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  // --- 여기까지 수정 ---

  const handleSavePreferences = async (newPreferences: string[]) => {
    setIsLoading(true);
    try {
      await updateUserPreferences(newPreferences);
      setPreferences(newPreferences);
      toast({
        title: "취향 설정 완료",
        description: "취향이 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "취향 저장에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 프로필 + 배너 섹션 - 같은 행 배치 */}
      <div className="flex gap-6 mb-8">
        {/* 프로필 섹션 - 흰색 배경 카드 */}
        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm w-[500px]">
          <div className="flex items-center gap-4">
            {/* --- 프로필 이미지 UI 수정 --- */}
            <div
              className="relative w-[60px] h-[60px] rounded-full cursor-pointer group bg-slate-300 overflow-hidden"
              onClick={() => setIsCropModalOpen(true)} // 모달을 열도록 변경
            >
              <Image
                src={userData.user.avatar_url || "/neo_emblem.svg"}
                alt="profile image"
                fill
                style={{ objectFit: "cover" }}
                className="transition-opacity duration-300 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100">변경</span>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  {/* 간단한 스피너 UI */}
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {/* --- 여기까지 수정 --- */}
            <h1 className="text-xl font-bold">{userData.user.nickname}</h1>
          </div>
          <Button
            variant={"outline"}
            className="rounded-full text-sm px-6 py-2"
            onClick={() => setIsProfileEditModalOpen(true)} // 프로필 편집 모달 열기
          >
            프로필 편집
          </Button>
        </div>

        {/* 배너 섹션 */}
        <Link href="/create" className="flex-1">
          <div className="relative w-full h-32 rounded-lg overflow-hidden cursor-pointer">
            <Image
              src="https://ocdthvsbuvikwyrjogcd.supabase.co/storage/v1/object/public/novel-covers/676d3787-37db-448d-80c6-02afc0824dee/0.7380132379345876.webp"
              alt="소설 제작하기"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white p-4">
              <h2 className="text-xl font-bold">
                작가님만의 세계관을 만들어보아요!
              </h2>
              <p className="text-sm">소설 제작하기</p>
            </div>
          </div>
        </Link>
      </div>

      {/* --- 크롭 모달 렌더링 --- */}
      <ProfileImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handleCroppedImageSave}
      />
      
      {/* --- 프로필 편집 모달 렌더링 --- */}
      <ProfileEditModal
        isOpen={isProfileEditModalOpen}
        onClose={() => setIsProfileEditModalOpen(false)}
        currentNickname={userData.user.nickname}
        onNicknameUpdate={() => router.refresh()}
        onImageEditClick={() => setIsCropModalOpen(true)}
      />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="w-full">
        {/* 내 취향 설정 섹션 - 검은색 배경 */}
        <section className="mb-8 bg-black rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-white">내 취향 설정</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Image
                src="/genresetting.svg"
                alt="장르 설정"
                width={20}
                height={20}
              />
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {preferences.map((pref) => (
              <span 
                key={pref} 
                className="border border-white bg-gray-900 text-white text-sm px-3 py-1 rounded-full"
              >
                {pref}
              </span>
            ))}
          </div>
        </section>

        {userData.novels && userData.novels.length > 0 ? (
          <NovelListClient novels={userData.novels} />
        ) : (
          <div className="text-center py-10">
            <p>아직 제작한 세계관이 없습니다.</p>
            <p>첫 번째 소설을 제작해보세요!</p>
          </div>
        )}
      </div>

      {/* 취향 설정 모달 */}
      <PreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPreferences={preferences}
        onSave={handleSavePreferences}
        isLoading={isLoading}
      />
    </div>
  );
}

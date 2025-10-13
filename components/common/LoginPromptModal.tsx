"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Star } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl: string;
}

/**
 * 로그인 유도 모달 컴포넌트
 *
 * 비로그인 사용자가 소설 진입 시도 시 표시되는 모달입니다.
 * 로그인을 유도하며, 확인 버튼 클릭 시 로그인 페이지로 이동합니다.
 */
export function LoginPromptModal({
  isOpen,
  onClose,
  returnUrl,
}: LoginPromptModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    // 로그인 페이지로 이동하며 returnUrl 파라미터 전달
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg border-0 p-0 overflow-hidden bg-transparent shadow-2xl"
      >
        <DialogTitle className="sr-only">로그인 안내</DialogTitle>
        <DialogDescription className="sr-only">
          소설을 이용하려면 로그인이 필요합니다.
        </DialogDescription>

        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            }}
          />
          {/* 반짝이는 오버레이 */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.6) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="relative z-10 flex flex-col items-center gap-8 py-10 px-8">
          {/* 아이콘 영역 */}
          <div className="relative">
            {/* 메인 아이콘 컨테이너 */}
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
                boxShadow:
                  "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.5)",
              }}
            >
              <Gift className="w-14 h-14 text-purple-600 drop-shadow-xl" />

              {/* 코너 별 장식 */}
              <Star className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300" />
              <Star
                className="absolute -bottom-2 -left-2 w-5 h-5 text-pink-300"
              />
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="text-center space-y-5">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">
                간편하게 로그인하고
              </h3>
              <div className="relative inline-block">
                <p
                  className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg tracking-wide leading-relaxed"
                >
                  10회 무료 이용권
                </p>
                <div className="absolute -right-7 -top-1">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
              <p
                className="text-2xl font-bold text-white drop-shadow-lg tracking-wide"
              >
                받아가세요!
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col gap-3 w-full mt-2">
            <Button
              onClick={handleConfirm}
              className="w-full text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 tracking-wide active:scale-95 relative overflow-hidden group"
              size="lg"
              style={{
                background:
                  "linear-gradient(135deg, #d946ef 0%, #fb7185 100%)",
              }}
            >
              <span className="relative flex items-center justify-center gap-2">
                로그인하고 시작하기
              </span>
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/80 hover:text-white hover:bg-transparent backdrop-blur-sm font-semibold tracking-wide transition-all duration-200"
            >
              나중에 할게요
            </Button>
          </div>
        </div>

        <style jsx global>{`
          .active\\:scale-95:active {
            transform: scale(0.95);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}


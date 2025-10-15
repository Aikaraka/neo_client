"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles, Star } from "lucide-react";

interface TokenInsufficientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 토큰 부족 모달 컴포넌트
 *
 * 사용자가 조각(토큰)을 모두 소진했을 때 표시되는 모달입니다.
 * 스토어 페이지로 이동하여 조각을 충전하도록 유도합니다.
 */
export function TokenInsufficientModal({
  isOpen,
  onClose,
}: TokenInsufficientModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    router.push('/store');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg border-0 p-0 overflow-hidden bg-transparent shadow-2xl"
      >
        <DialogTitle className="sr-only">조각 부족 안내</DialogTitle>
        <DialogDescription className="sr-only">
          조각을 모두 사용했습니다. 조각을 충전해주세요.
        </DialogDescription>

        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd876 100%)",
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
              <Coins className="w-14 h-14 text-orange-600 drop-shadow-xl" />

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
                조각이 다 떨어졌어요!
              </h3>
              <div className="relative inline-block">
                <p
                  className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg tracking-wide leading-relaxed"
                >
                  더 많은 소설을 보려면
                </p>
                <div className="absolute -right-7 -top-1">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
              <p
                className="text-2xl font-bold text-white drop-shadow-lg tracking-wide"
              >
                조각을 충전해주세요
              </p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 w-full max-w-xs">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="flex-1 bg-white/90 hover:bg-white text-gray-700 border-0 shadow-lg font-semibold text-base rounded-xl"
            >
              나중에
            </Button>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="flex-1 bg-white text-purple-600 hover:bg-white/90 border-0 shadow-lg font-bold text-base rounded-xl"
            >
              조각 충전하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


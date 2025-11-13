"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl: string;
  onConfirm?: () => void; // 로그인 페이지 이동 전 추가 처리를 위한 콜백
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
  onConfirm,
}: LoginPromptModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    // 부모 컴포넌트에서 전달된 추가 처리 실행 (예: 부모 모달 닫기)
    onConfirm?.();
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

        {/* 배경 베이지색 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#D9D9C7]" />

        {/* 컨텐츠 영역 */}
        <div className="relative z-10 flex flex-col items-center gap-8 py-10 px-8">
          {/* 아이콘 영역 */}
          <div className="relative">
            <Gift className="w-20 h-20 text-purple-600" />
          </div>

          {/* 메시지 영역 */}
          <div className="text-center space-y-5">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-800 tracking-wide">
                간편하게 로그인하고
              </h3>
              <div className="relative inline-block">
                <p
                  className="text-2xl font-bold bg-gradient-to-r from-rose-500 via-orange-400 to-amber-500 bg-clip-text text-transparent tracking-wide leading-relaxed"
                  style={{
                    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                  }}
                >
                  10회 무료 이용권
                </p>
                <p
                  className="text-2xl font-bold text-gray-800 tracking-wide"
                >
                  받아가세요!
                </p>
              </div>
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
              className="w-full text-black/80 hover:bg-transparent hover:text-black/80 backdrop-blur-sm font-semibold tracking-wide transition-all duration-200"
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


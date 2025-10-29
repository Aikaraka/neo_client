import React, { cloneElement, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import { Bell, LogOut, Settings, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ViewSettingsPanel } from "./ViewSettingsPanel";

interface MoreMenuProps {
  children: React.ReactElement;
  onShowImageArchive: () => void;
  onColorChange?: (color: string) => void;
  selectedColor: string;
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  paragraphWidth: number;
  onFontSizeChange: (size: number) => void;
  onLineHeightChange: (lh: number) => void;
  onParagraphSpacingChange: (ps: number) => void;
  onParagraphWidthChange: (width: number) => void;
  brightness: number;
  onBrightnessChange: (brightness: number) => void;
  font: string;
  onFontChange: (font: string) => void;
}

function DiamondIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.2298 7.04405L6.23438 1.55619C6.16491 1.46106 6.07369 1.38393 5.96834 1.33125C5.86177 1.27782 5.74421 1.25 5.625 1.25C5.50579 1.25 5.38823 1.27782 5.28166 1.33125C5.17656 1.38402 5.08559 1.46115 5.01632 1.55619L1.02021 7.04405C0.845204 7.28236 0.750567 7.57017 0.75 7.86584C0.75 8.15973 0.844018 8.44666 1.02021 8.68762L5.01632 14.1755C5.08457 14.2695 5.1758 14.3468 5.28096 14.3997C5.38762 14.4533 5.50531 14.4812 5.62465 14.4812C5.74399 14.4812 5.86168 14.4533 5.96834 14.3997C6.0742 14.3468 6.16543 14.2695 6.23368 14.1755L10.2298 8.68762C10.406 8.44666 10.5 8.15973 10.5 7.86584C10.4994 7.57017 10.4048 7.28236 10.2298 7.04405Z" stroke="#BE7AD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.759766 8.00146L5.62432 10.0093M5.62432 10.0093L10.4889 8.00146M5.62432 10.0093V14.4824" stroke="#BE7AD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MoreMenu({ 
  children,
  onShowImageArchive,
  onColorChange, 
  selectedColor, 
  fontSize, 
  lineHeight, 
  paragraphSpacing, 
  paragraphWidth, 
  onFontSizeChange, 
  onLineHeightChange, 
  onParagraphSpacingChange, 
  onParagraphWidthChange, 
  brightness, 
  onBrightnessChange, 
  font, 
  onFontChange 
}: MoreMenuProps) {
  const [point, setPoint] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isViewSettings, setIsViewSettings] = useState(false);
  const router = useRouter();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-end',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  
  async function fetchUserPoint() {
    try {
      const supabase = createClient();
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user?.id) throw new Error("로그인 필요");
      const { data: tokenData, error: tokenError } = await supabase
        .from("user_ai_token")
        .select("remaining_tokens")
        .eq("user_id", user.user.id)
        .single();
      if (tokenError) throw new Error("포인트 정보를 찾을 수 없습니다.");
      return tokenData?.remaining_tokens ?? 0;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchUserPoint().then(setPoint);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleNoticeClick = () => {
    router.push('/notice');
  };

  const handleViewSettingsClick = () => {
    setIsOpen(false);
    setIsViewSettings(true);
  };

  const handleShowImageArchiveClick = () => {
    setIsOpen(false);
    onShowImageArchive();
  };

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 w-56 rounded-xl bg-white p-2 shadow-xl border border-gray-200/80"
          >
            {/* Point Section */}
            <div className="px-2 py-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-800">잔여 포인트</span>
              <span
                className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-2 py-1 text-sm"
              >
                <DiamondIcon size={13} />
                <span className="ml-1.5 font-semibold text-gray-700">{point ?? "-"}</span>
              </span>
            </div>

            <hr className="my-1 border-gray-100" />

            {/* Menu Items Section */}
            <div className="flex flex-col">
              <button
                onClick={handleViewSettingsClick}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">보기 설정</span>
              </button>
              <button
                onClick={handleNoticeClick}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">공지사항</span>
              </button>
              <button
                onClick={handleShowImageArchiveClick}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
              >
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">이미지 보관함</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">로그아웃</span>
              </button>
            </div>
          </div>
        )}
      </FloatingPortal>

      {/* ViewSettingsPanel */}
      {isViewSettings && (
        <ViewSettingsPanel
          onClose={() => setIsViewSettings(false)}
          onColorChange={onColorChange}
          selectedColor={selectedColor}
          fontSize={fontSize}
          onFontSizeChange={onFontSizeChange}
          lineHeight={lineHeight}
          onLineHeightChange={onLineHeightChange}
          paragraphSpacing={paragraphSpacing}
          onParagraphSpacingChange={onParagraphSpacingChange}
          paragraphWidth={paragraphWidth}
          onParagraphWidthChange={onParagraphWidthChange}
          brightness={brightness}
          onBrightnessChange={onBrightnessChange}
          font={font}
          onFontChange={onFontChange}
        />
      )}
    </>
  );
}

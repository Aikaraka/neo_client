import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface PointPopupProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

// diamond.svg를 리액트 컴포넌트로 인라인 변환
function DiamondIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.2298 7.04405L6.23438 1.55619C6.16491 1.46106 6.07369 1.38393 5.96834 1.33125C5.86177 1.27782 5.74421 1.25 5.625 1.25C5.50579 1.25 5.38823 1.27782 5.28166 1.33125C5.17656 1.38402 5.08559 1.46115 5.01632 1.55619L1.02021 7.04405C0.845204 7.28236 0.750567 7.57017 0.75 7.86584C0.75 8.15973 0.844018 8.44666 1.02021 8.68762L5.01632 14.1755C5.08457 14.2695 5.1758 14.3468 5.28096 14.3997C5.38762 14.4533 5.50531 14.4812 5.62465 14.4812C5.74399 14.4812 5.86168 14.4533 5.96834 14.3997C6.0742 14.3468 6.16543 14.2695 6.23368 14.1755L10.2298 8.68762C10.406 8.44666 10.5 8.15973 10.5 7.86584C10.4994 7.57017 10.4048 7.28236 10.2298 7.04405Z" stroke="#BE7AD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.759766 8.00146L5.62432 10.0093M5.62432 10.0093L10.4889 8.00146M5.62432 10.0093V14.4824" stroke="#BE7AD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PointPopup({ open, onClose, anchorRef }: PointPopupProps) {
  const [point, setPoint] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // supabase에서 유저 포인트 직접 fetch
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
    if (open) {
      fetchUserPoint().then(setPoint);
    }
  }, [open]);

  // 오버레이 클릭 시 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  // 팝업 위치: anchorRef(점 세개 버튼) 기준 우측 상단, Figma 스타일 적용
  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.bottom + 8, // 버튼 바로 아래
        left: rect.right - 180, // 팝업을 더 왼쪽으로 이동
        width: 180,
        height: 43,
        zIndex: 50,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        gap: 10,
      });
    }
  }, [open, anchorRef]);

  if (!open) return null;

  return (
    <>
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      {/* 팝업 */}
      <div
        ref={popupRef}
        style={{ ...style, width: undefined }}
        className="z-50 border flex items-center justify-start"
      >
        <span
          style={{
            fontFamily: 'NanumSquare Neo OTF',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '14px',
            color: '#575A5C',
            marginRight: 8,
            whiteSpace: 'nowrap',
          }}
        >
          잔여 포인트
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F1F1',
            border: '1.5px solid #C8C8C8',
            borderRadius: 20,
            padding: '2px 8px 2px 8px',
            fontWeight: 400,
            fontSize: 13,
            color: '#232325',
            gap: 3,
            height: 28,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><DiamondIcon size={13} /></span>
          <span style={{ fontWeight: 400, fontSize: 13, color: '#232325', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', lineHeight: 1, position: 'relative', top: '1px', textAlign: 'right' }}>{point ?? "-"}</span>
        </span>
      </div>
    </>
  );
}

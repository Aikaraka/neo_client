"use client";

// 더 이상 모달을 직접 렌더링하지 않으므로 모든 import를 제거할 수 있습니다.
// 만약 다른 클라이언트 로직이 필요하다면 "use client"는 유지합니다.

export default function GenrePageClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // 모달 렌더링 코드가 제거되었으므로, 이 컴포넌트는
  // 단순히 children만 반환하는 래퍼(wrapper)가 됩니다.
  return <>{children}</>;
} 
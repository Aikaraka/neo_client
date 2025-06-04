import React from "react";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // NavBarDesktop의 너비(89px)만큼 데스크탑 화면(lg 이상)에서 왼쪽에 마진을 적용합니다.
    // flex-1과 flex flex-col을 추가하여 RootLayout의 main 공간을 올바르게 채우고
    // 내부 콘텐츠(각 page.tsx)가 세로로 잘 정렬되도록 합니다.
    // p-4 sm:p-6 md:p-8은 콘텐츠 영역의 기본 패딩입니다.
    // overflow-y-auto를 추가하여 콘텐츠가 길어질 경우 이 영역 내에서 스크롤되도록 합니다.
    <div className="lg:ml-[89px] flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto">
      {children}
    </div>
  );
} 
"use client";

import React from "react";

interface GlassBrowserFrameProps {
  children: React.ReactNode;
}

export function GlassBrowserFrame({ children }: GlassBrowserFrameProps) {
  return (
    <div className="
      w-full h-full
      liquid-glass-modal
      overflow-hidden
      relative
      flex flex-col
    ">
      {/* 브라우저 상단 바 - Glass 효과 */}
      <div className="
        h-12 liquid-browser-frame
        border-b border-white/20
        flex items-center px-4
        relative
      ">
        {/* 트래픽 라이트 버튼들 */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm"></div>
        </div>

        {/* 주소창 */}
        <div className="
          flex-1 mx-6 h-7 
          bg-white/20 backdrop-blur-sm
          border border-white/30 
          rounded-lg px-3
          flex items-center
          text-gray-700 text-sm
        ">
          <span className="text-purple-400">🔒</span>
          <span className="ml-2 font-medium">neo.app</span>
          <div className="ml-auto text-xs text-purple-400 font-medium">
            ✨ AI 소설 플랫폼
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="
        flex-1
        liquid-content
        relative
      ">


        {/* 실제 컨텐츠 */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          {children}
        </div>
      </div>


    </div>
  );
}

import React from "react";
import { OnboardingStep } from "@/components/onboarding/types";

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "다양한 유저가 만든 세계관들을 살펴보세요!",
    description: "원하는 키워드로 검색할 수도 있습니다.\n보호필터를 사용하여, 다양한 장소에서도 편하게 Neo를 이용하세요.",
    content: (
      <div className="flex items-center justify-center h-55 w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="/page1.png" 
          alt="Neo 홈페이지 - 세계관 탐색"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    )
  },
  {
    id: 2,
    title: "'세계관 읽기' 클릭 한 번으로 원하는 세계관 속에 입장하세요.",
    description: "세계관 줄거리와 세계관 등장인물 등을 살펴보세요.\n만약, 마음에 드는 스토리가 없다면 직접 세계관을 제작할 수도 있습니다!",
    content: (
      <div className="flex items-center justify-center h-55 w-full max-w-xl mx-auto bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-2xl shadow-lg relative">
        <div className="text-center space-y-4">
          <div className="flex items-center space-x-4">
            {/* 세계관 표지 */}
            <div className="w-24 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden">
              <span className="text-white text-2xl">📖</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* 세계관 정보 */}
            <div className="text-left space-y-2">
              <h3 className="text-lg font-bold text-purple-800">마법의 도서관</h3>
              <p className="text-sm text-gray-600">판타지 • 로맨스</p>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-700">4.8 (1.2k)</span>
              </div>
            </div>
          </div>
          
          {/* 세계관 읽기 버튼 */}
          <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg animate-pulse hover:scale-105 transition-transform">
            📚 세계관 읽기
          </button>
        </div>
        
        {/* 강조 효과 */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-bounce">
          클릭! →
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "소설 속 첫 장면을 읽고, 대사를 입력하여 보세요.",
    description: "입력한 대사에 따라 Neo가 다음 이야기를 이어갑니다.\n꼭 '대사'가 아니어도 상관없습니다.\n소설 표지까지 AI가 한 번에 완성해줍니다!",
    content: (
      <div className="flex items-center justify-center h-55 w-full max-w-xl mx-auto bg-gradient-to-br from-green-100 via-teal-50 to-blue-100 rounded-2xl shadow-lg">
        <div className="w-full max-w-sm space-y-4">
          {/* 소설 진행 상황 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
            <div className="text-xs text-purple-600 font-medium mb-2 flex items-center">
              <span className="mr-2">📖</span>
              소설 속 첫 장면
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              "당신은 신비로운 도서관에 들어섰습니다. 무수한 책들이 하늘 높이 쌓여있고, 마법의 향기가 공기 중에 떠다닙니다..."
            </p>
          </div>
          
          {/* 대화 입력창 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-green-200">
            <div className="text-xs text-green-600 mb-2 flex items-center">
              <span className="mr-2">💬</span>
              대사를 입력하세요
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center px-3">
                <span className="text-gray-400 text-sm">여기에 당신의 대사를...</span>
              </div>
              <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <span className="text-white">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "왼쪽 바의 '세계관 저작'을 눌러, 새로운 이야기를 써보세요!",
    description: "한 줄 제목부터, 멋진 커버까지 모두 직접 설정할 수 있습니다.",
    content: (
      <div className="flex items-center justify-center h-55 w-full max-w-xl mx-auto bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-6">
          {/* 사이드바 */}
          <div className="space-y-3">
            <div className="w-12 h-10 bg-gray-200 rounded-lg"></div>
            <div className="relative">
              <div className="w-12 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-xl animate-bounce">
                <span className="text-white font-bold">+</span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <div className="w-12 h-10 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* 생성 영역 */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl mb-2">✨</div>
              <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                새로운 이야기 만들기
              </div>
            </div>
            
            {/* 옵션들 */}
            <div className="flex space-x-2">
              {['제목', '장르', '캐릭터'].map((option, i) => (
                <div key={option} className={`px-3 py-2 rounded-lg text-sm font-medium shadow-md ${
                  i === 0 ? 'bg-orange-500 text-white' : 
                  i === 1 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "AI와 함께, 세계관을 손쉽게 만들어보세요!",
    description: "줄거리와 인물 설정, AI가 자연스럽게 도와드려요.\n키워드만 입력해도 이야기 배경을 제안받을 수 있어요.\n세계관 표지까지 AI가 한 번에 완성해줍니다!",
    content: (
      <div className="flex items-center justify-center h-55 w-full max-w-xl mx-auto bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 rounded-2xl shadow-lg">
        <div className="text-center space-y-6 w-full max-w-sm">
          {/* AI 협업 헤더 */}
          <div className="flex justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl animate-bounce" style={{animationDelay: '0.2s'}}>
              <span className="text-white text-2xl">✍️</span>
            </div>
          </div>
          
          {/* AI 대화 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
            <div className="text-xs text-purple-600 font-medium mb-2 flex items-center">
              <span className="mr-2">🤖</span>
              AI 어시스턴트
              <div className="flex space-x-1 ml-auto">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "환상적인 마법 학교를 배경으로 한 이야기는 어떠세요? 줄거리와 캐릭터를 자동으로 생성해드릴게요!"
            </p>
          </div>
          
          {/* 생성 진행바 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-200">
            <div className="text-xs text-blue-600 mb-2 flex items-center">
              <span className="mr-2">✨</span>
              세계관 생성 중...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-2000 w-3/4 animate-pulse"></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">표지 디자인까지 완성됩니다!</div>
          </div>
        </div>
      </div>
    )
  }
];

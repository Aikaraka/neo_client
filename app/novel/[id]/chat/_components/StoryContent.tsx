"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface StoryContentProps {
  fontSize: number;
  lineHeight: number;
  paragraphSpacing: number;
  paragraphWidth: number;
  font: string;
  isDark?: boolean;
  messageBoxRef: React.RefObject<HTMLDivElement>;
}

export function StoryContent({ fontSize, lineHeight, paragraphSpacing, paragraphWidth, font, isDark = false, messageBoxRef }: StoryContentProps) {
  const { 
    background, 
    messages, 
    fetchMoreStories, 
    hasMoreStories, 
    isMessageSending, 
    streamingBackgroundStart, 
    isBackgroundStreaming, 
    protagonist_name, 
    showProtagonistMessage, 
    isAutoScrollEnabled, 
    setIsAutoScrollEnabled,
    isFirstVisit
  } = useStoryContext();
  
  const interSectionRef = useRef<HTMLDivElement>(null);
  
  // 폰트 매핑
  const getFontFamily = (fontName: string) => {
    switch (fontName) {
      case "나눔고딕":
        return "'NanumGothic', sans-serif";
      case "나눔명조":
        return "'NanumMyeongjo', serif";
      case "KoPubWorld 돋움체":
        return "'KoPubWorldDotum', sans-serif";
      case "KoPubWorld 바탕체":
        return "'KoPubWorldBatang', serif";
      default:
        return "'NanumMyeongjo', serif";
    }
  };
  
  const fontFamily = getFontFamily(font);
  
  // 맨 아래에 있는지 확인
  const isNearBottom = useCallback((element: HTMLElement, threshold = 100) => {
    return element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
  }, []);

  // 콘텐츠 변경 감지를 위한 시그니처 (마지막 메시지의 키와 길이)
  const prevSignatureRef = useRef<string>("");
  const scrollScheduledRef = useRef(false);
  const rafIdRef = useRef<number>(0);

  // 맨 아래로 스크롤 (Easing 애니메이션 사용)
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const messageBox = messageBoxRef.current;
    if (!messageBox) return;
    
    // 이미 스크롤이 예약되어 있으면 중복 실행 방지
    if (scrollScheduledRef.current) return;
    
    const targetTop = messageBox.scrollHeight;
    const startTop = messageBox.scrollTop;
    const distance = targetTop - startTop;
    
    // 거리가 10px 미만이면 스크롤 불필요
    if (Math.abs(distance) < 10) return;
    
    scrollScheduledRef.current = true;
    
    if (behavior === "instant") {
      // 즉시 스크롤
      messageBox.scrollTop = targetTop;
      scrollScheduledRef.current = false;
    } else {
      // Easing 애니메이션으로 부드러운 스크롤
      const duration = Math.min(600, Math.max(200, Math.abs(distance) * 0.5)); // 동적 duration
      let startTime: number | null = null;
      
      // easeOutCubic: 시작은 빠르고 끝은 부드럽게
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      
      const step = (ts: number) => {
        // 자동 스크롤이 비활성화되었거나 사용자가 스크롤 중이면 중단
        if (!isAutoScrollEnabled || isUserScrollingRef.current) {
          rafIdRef.current = 0;
          scrollScheduledRef.current = false;
          return;
        }
        
        if (startTime === null) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(1, elapsed / duration);
        const nextTop = startTop + distance * easeOutCubic(progress);
        
        messageBox.scrollTop = nextTop;
        
        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          rafIdRef.current = 0;
          scrollScheduledRef.current = false;
        }
      };
      
      rafIdRef.current = requestAnimationFrame(step);
    }
  }, [messageBoxRef, isAutoScrollEnabled]);

  // 재방문자 초기 스크롤 (메시지가 로드된 직후)
  useLayoutEffect(() => {
    if (!isFirstVisit && messages.length > 0) {
      scrollToBottom("instant");
    }
  }, [isFirstVisit, messages.length, scrollToBottom]);

  // 사용자 스크롤 추적 (자동 스크롤과 구분하기 위해)
  const isUserScrollingRef = useRef(false);
  const lastUserScrollTime = useRef(0);
  const USER_SCROLL_TIMEOUT = 300; // 사용자 스크롤 종료로 간주하는 시간 (300ms)

  // 스크롤 이벤트 핸들러 - 유저가 위로 올리면 자동 스크롤 즉시 멈춤, 맨 밑으로 내리면 재개
  const SCROLL_LOCK_THRESHOLD = 200; // 하단 200px 이내에 있으면 자동 스크롤 활성화
  
  useEffect(() => {
    const messageBox = messageBoxRef.current;
    if (!messageBox) return;

    let lastScrollTop = messageBox.scrollTop;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const currentScrollTop = messageBox.scrollTop;
      const scrollDelta = currentScrollTop - lastScrollTop;
      lastScrollTop = currentScrollTop;
      
      // 하단으로부터의 거리 계산
      const distanceFromBottom = 
        messageBox.scrollHeight - (messageBox.scrollTop + messageBox.clientHeight);
      
      // 사용자가 수동으로 스크롤 중인지 감지
      if (Math.abs(scrollDelta) > 5) { // 5px 이상 변화는 사용자 스크롤로 간주
        isUserScrollingRef.current = true;
        lastUserScrollTime.current = Date.now();
        
        // 하단 200px 이내에 있으면 자동 스크롤 활성화, 아니면 비활성화
        const shouldAutoScroll = distanceFromBottom <= SCROLL_LOCK_THRESHOLD;
        
        if (shouldAutoScroll !== isAutoScrollEnabled) {
          setIsAutoScrollEnabled(shouldAutoScroll);
        }
        
        // 자동 스크롤이 꺼졌으면 진행 중인 애니메이션도 중단
        if (!shouldAutoScroll && rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = 0;
          scrollScheduledRef.current = false;
        }
      }
      
      // 스크롤이 멈춘 후 상태 체크 (디바운싱)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        // 사용자 스크롤 종료 체크
        const timeSinceLastScroll = Date.now() - lastUserScrollTime.current;
        if (timeSinceLastScroll >= USER_SCROLL_TIMEOUT) {
          isUserScrollingRef.current = false;
        }
        
        // 최종 상태 체크
        const finalDistanceFromBottom = 
          messageBox.scrollHeight - (messageBox.scrollTop + messageBox.clientHeight);
        const shouldAutoScroll = finalDistanceFromBottom <= SCROLL_LOCK_THRESHOLD;
        
        if (shouldAutoScroll !== isAutoScrollEnabled) {
          setIsAutoScrollEnabled(shouldAutoScroll);
        }
      }, 200); // 200ms 후 스크롤 완료로 간주
    };

    messageBox.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      messageBox.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      // 컴포넌트 언마운트 시 애니메이션 정리
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [messageBoxRef, isAutoScrollEnabled, setIsAutoScrollEnabled]);

  // 자동 스크롤 - 메시지가 업데이트될 때 (스트리밍 중일 때만)
  // 시그니처 기반 변경 감지로 불필요한 스크롤 방지
  useEffect(() => {
    // 사용자가 수동으로 스크롤 중이면 자동 스크롤 완전 차단
    const timeSinceLastUserScroll = Date.now() - lastUserScrollTime.current;
    const USER_SCROLL_TIMEOUT_MS = 300; // 사용자 스크롤 종료로 간주하는 시간
    const isCurrentlyUserScrolling = isUserScrollingRef.current || timeSinceLastUserScroll < USER_SCROLL_TIMEOUT_MS;
    
    // 자동 스크롤이 활성화되어 있고, 스트리밍 중일 때만 스크롤
    if (!isAutoScrollEnabled || messages.length === 0 || !isMessageSending || isCurrentlyUserScrolling) {
      return;
    }
    
    // 콘텐츠 변경 감지: 마지막 메시지의 시그니처 계산
    const currentSignature = (() => {
      if (messages.length === 0) return "";
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type !== "ai") return "";
      // 메시지 키(story_number)와 콘텐츠 길이로 시그니처 생성
      const contentLength = lastMessage.content?.length || 0;
      return `${lastMessage.story_number || 0}-${contentLength}`;
    })();
    
    // 변경이 없으면 스크롤 생략
    if (currentSignature === prevSignatureRef.current) return;
    if (scrollScheduledRef.current) return; // 이미 스크롤 예약됨
    
    // 시그니처 업데이트
    prevSignatureRef.current = currentSignature;
    
    // 이중 requestAnimationFrame으로 DOM 업데이트 보장
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // DOM 업데이트 후 스크롤 실행
        scrollToBottom("smooth");
      });
    });
  }, [messages, isAutoScrollEnabled, isMessageSending, scrollToBottom]);
  
  // 스트리밍 완료 시 자동 스크롤 (한 번만)
  useEffect(() => {
    // 스트리밍이 완료되고 자동 스크롤이 활성화되어 있으면 맨 아래로
    if (!isMessageSending && isAutoScrollEnabled && messages.length > 0) {
      const messageBox = messageBoxRef.current;
      if (messageBox) {
        const nearBottom = isNearBottom(messageBox, 150);
        // 맨 아래 근처에 있으면 자동 스크롤
        if (nearBottom) {
          scrollToBottom("smooth");
        }
      }
    }
  }, [isMessageSending, isAutoScrollEnabled, messages.length, isNearBottom, scrollToBottom, messageBoxRef]);

  // 이전 스토리 로드 (IntersectionObserver)
  useLayoutEffect(() => {
    if (!messageBoxRef.current || !interSectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreStories) {
          const messageBox = messageBoxRef.current;
          if (!messageBox) return;
          
          const prevScrollHeight = messageBox.scrollHeight;
          const prevScrollTop = messageBox.scrollTop;
          
          fetchMoreStories().then(() => {
            setTimeout(() => {
              const currentMessageBox = messageBoxRef.current;
              if (!currentMessageBox) return;
              
              const newScrollHeight = currentMessageBox.scrollHeight;
              const heightDifference = newScrollHeight - prevScrollHeight;
              currentMessageBox.scrollTo({
                top: prevScrollTop + heightDifference,
                behavior: "instant",
              });
            }, 0);
          });
        }
      },
      { root: messageBoxRef.current, threshold: 0.3 }
    );
    
    observer.observe(interSectionRef.current);
    return () => observer.disconnect();
  }, [messageBoxRef, interSectionRef, hasMoreStories, fetchMoreStories]);

  return (
    <div
      className="flex-1 overflow-auto px-4 py-2 space-y-4"
      style={{ 
        maxWidth: paragraphWidth,
        margin: "0 auto",
      }}
    >
      <div ref={interSectionRef} style={{ height: 1 }} />
      
      {/* 배경 설명 */}
      <div
        className="whitespace-pre-wrap"
        style={{ 
          fontFamily,
          fontSize: `${fontSize + 2}px`,
          fontWeight: 600,
          lineHeight: lineHeight * 1.2,
          color: isDark ? "#E5E7EB" : "#1F2937",
          marginBottom: `${paragraphSpacing * 1.5}px`,
        }}
      >
        {isBackgroundStreaming || streamingBackgroundStart 
          ? streamingBackgroundStart || ""
          : background?.start ?? "여러분들의 소설을 시작해보세요."
        }
      </div>

      {/* 주인공 소개 메시지 */}
      {showProtagonistMessage && protagonist_name && (
        <div
          className="text-center mb-6 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50"
          style={{ 
            fontFamily,
            fontSize: `${fontSize}px`,
            marginBottom: `${paragraphSpacing * 1.5}px`,
          }}
        >
          <span className="text-gray-700">당신의 캐릭터는 </span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {protagonist_name}
          </span>
          <span className="text-gray-700"> 입니다. <br /> 멈춘 문장 너머로, 새로운 이야기가 기다립니다.</span>
        </div>
      )}

      {/* 메시지 렌더링 */}
      {messages.map((msg, i) => {
        if (msg.type === "user") {
          const paragraphs = msg.content.split('\n\n').filter(Boolean);
          return (
            <div key={i}>
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="whitespace-pre-line tracking-wide text-neo-purple"
                  style={{ 
                    color: isDark ? "#BE7AD3" : "#9125B1", 
                    WebkitTextFillColor: isDark ? "#BE7AD3" : "#9125B1", 
                    fontWeight: 200,
                    fontSize: `${fontSize + 2}px`,
                    lineHeight: lineHeight * 1.2,
                    marginBottom: `${paragraphSpacing}px`,
                    marginTop: `${paragraphSpacing}px`,
                    textAlign: "left",
                    fontFamily,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          );
        } else if (msg.type === "ai") {
          const paragraphs = msg.content.split('\n\n').filter(Boolean);
          return (
            <div key={i}>
              {msg.image_url && (
                <div className="relative w-full aspect-video mb-4">
                  <Image
                    src={msg.image_url}
                    alt={`Story image ${i}`}
                    fill={true}
                    className="rounded-lg object-contain"
                  />
                </div>
              )}
              {paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="text-gray-800 whitespace-pre-line tracking-wide"
                  style={{ 
                    color: isDark ? "#fff" : undefined,
                    fontSize: `${fontSize + 2}px`,
                    fontWeight: 200,
                    lineHeight: lineHeight * 1.2,
                    marginBottom: `${paragraphSpacing / 2}px`,
                    marginTop: `${paragraphSpacing / 2}px`,
                    textAlign: "left",
                    fontFamily,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          );
        }
      })}
      
      {/* 로딩 인디케이터 */}
      {isMessageSending && (() => {
        const lastMessage = messages[messages.length - 1];
        const shouldShowPending = !lastMessage || lastMessage.type !== "ai" || !lastMessage.content;
        return shouldShowPending ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-pulse">
              <p style={{ fontFamily, color: isDark ? "#fff" : "#232325" }}>
                Neo가 소설을 작성중이에요...
              </p>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}


"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  initStory,
  InitStoryResponse,
} from "@/app/novel/[id]/chat/_api/initStory.api";
import * as Sentry from "@sentry/nextjs";
import { getPreviousStories } from "@/app/novel/[id]/chat/_api/prevStory.api";
import { processNovel } from "@/app/novel/[id]/chat/_api/process.api";
import { undoLastStory } from "@/app/novel/[id]/chat/_api/undo.api";
import { generateImage } from "@/app/novel/[id]/chat/_api/generateImage.api";
import { LoadingModal } from "@/components/ui/modal";
import { TokenInsufficientModal } from "@/components/common/TokenInsufficientModal";
import { useToast } from "@/hooks/use-toast";
import { useSession, useAuthLoading } from "@/utils/supabase/authProvider";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter} from "next/navigation";

export type Message = {
  type: "user" | "ai"
  content: string
  story_number?: number
  user_input?: string
  image_url?: string
}

type StoryContextType = Omit<InitStoryResponse, "progress_rate"> & {
  messages: Message[];
  isMessageError: boolean;
  progressRate: number;
  undoStory: () => void;
  sendNovelProcessMessage: (auto: boolean, input?: string) => void;
  isMessageSending: boolean;
  initError: boolean;
  fetchMoreStories: () => Promise<void>;
  currPage: number;
  initPending: boolean;
  hasMoreStories: boolean;
  prevFetching: boolean;
  archivedImages: string[];
  isGeneratingImage: boolean;
  streamingBackgroundStart: string;
  isBackgroundStreaming: boolean;
  showProtagonistMessage: boolean;
  isFirstVisit: boolean;
  isAutoMode: boolean;
  toggleAutoMode: () => void;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStoryContext() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("StoryContext를 찾을 수 없습니다.");
  }
  return context;
}

const TOAST_GEN_NOVEL_ERROR_TITLE = "세계관 생성 오류";
const TOAST_GEN_NOVEL_ERROR_DESCRIPTION = "세계관 생성중 오류가 발생했습니다.";
const TOAST_UNDO_NOVEL_SUCCESS_TITLE = "소설 되돌리기";
const TOAST_UNDO_NOVEL_SUCCESS_DESCRIPTION = "소설을 되돌렸습니다.";
const TOAST_UNDO_NOVEL_ERROR_TITLE = "소설 되돌리기 오류";
const TOAST_UDNO_NOVEL_ERROR_DECRIPTION = "더 되돌릴 소설이 없습니다.";

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const { id: novelId } = useParams<{ id: string }>();
  const router = useRouter();
  const session = useSession();
  const authLoading = useAuthLoading();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [progressRate, setProgressRate] = useState(0);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [currPage, setCurrPage] = useState(0);
  const [hasMoreStories, setHasMoreStories] = useState(false);
  const [prevFetching, setPrevFetching] = useState(false);
  const [archivedImages, setArchivedImages] = useState<string[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedProgressMilestones, setGeneratedProgressMilestones] = useState<Set<number>>(new Set());
  const [streamingBackgroundStart, setStreamingBackgroundStart] = useState("");
  const [isBackgroundStreaming, setIsBackgroundStreaming] = useState(false);
  const [showProtagonistMessage, setShowProtagonistMessage] = useState(false);
  const [hasStreamedBackground, setHasStreamedBackground] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);

  // localStorage에서 모드 설정 로드
  useEffect(() => {
    const savedMode = localStorage.getItem("novel-auto-mode");
    if (savedMode !== null) {
      setIsAutoMode(savedMode === "true");
    }
  }, []);

  // 모드 토글 함수
  const toggleAutoMode = () => {
    setIsAutoMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("novel-auto-mode", String(newMode));
      return newMode;
    });
  };

  // 세션 체크: 로딩이 끝났고 세션이 없으면 즉시 리다이렉트 (API 호출 전)
  useEffect(() => {
    if (!authLoading && !session?.user) {
      const currentUrl = typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "";
      router.replace(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
    }
  }, [authLoading, session, router]);

  const {
    data: initialData,
    isPending: initPending,
    isError,
    error: initError,
  } = useQuery({
    queryKey: ["initStory", novelId],
    enabled: !!session && !authLoading, // 세션이 있고 로딩이 끝났을 때만 API 호출
    queryFn: async () => {
      try {
        const initSetting = await initStory(novelId);
        const restoredMessages: Message[] = [];
        for (const s of initSetting.initial_stories.slice().reverse()) {
          if (typeof s.user_input !== "undefined")
            restoredMessages.push({
              type: "user",
              content: s.user_input,
              story_number: s.story_number,
              user_input: s.user_input,
            })
          if (s.content)
            restoredMessages.push({
              type: "ai",
              content: s.content,
              story_number: s.story_number,
              user_input: s.user_input,
              image_url: s.image_url, // Add image_url from initial stories
            })
        }
        setMessages(restoredMessages);
        setProgressRate(initSetting.progress_rate);
        setCurrPage(initSetting.oldest_story_number);
        setHasMoreStories(initSetting.has_more_stories);
        
        // 처음 방문 여부 설정
        const isFirst = !initSetting.initial_stories || initSetting.initial_stories.length === 0;
        setIsFirstVisit(isFirst);
        
        return initSetting;
      } catch (error) {
        console.error(`[StoryProvider] initStory 실패:`, error);
        
        // Sentry에 에러 보고 (컨텍스트 포함)
        Sentry.captureException(error, {
          tags: { 
            component: "StoryProvider",
            action: "initStory",
          },
          extra: { 
            novelId,
            errorType: error instanceof Error ? error.constructor.name : typeof error,
            errorMessage: error instanceof Error ? error.message : String(error),
          },
        });
        
        // 세션 관련 에러인 경우 리다이렉트 (혹시 API 내부에서 세션 체크를 하는 경우 대비)
        if (error instanceof Error && error.message.includes("세션")) {
          const currentUrl = typeof window !== "undefined" 
            ? window.location.pathname + window.location.search 
            : "";
          router.replace(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
        } else if (error instanceof TypeError && error.message.includes("fetch")) {
          toast({
            title: "서버 연결 실패",
            description: "백엔드 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
            variant: "destructive",
          });
        }
        throw error;
      }
    },
  });

  // background.start를 스트리밍으로 표시하는 함수
  const streamBackgroundText = async (text: string) => {
    let accumulatedText = "";
    
    for (const char of text) {
      accumulatedText += char;
      setStreamingBackgroundStart(accumulatedText);
      // 각 문자마다 지연 (타이핑 효과)
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  };

  // 초기 데이터 로드 후 background 처리
  useEffect(() => {
    const startBackgroundStreaming = async () => {
      if (initialData && !initPending && !hasStreamedBackground) {
        setHasStreamedBackground(true);
        
        const backgroundText = initialData.background?.start ?? "여러분들의 소설을 시작해보세요.";
        
        if (isFirstVisit) {
          // 처음 방문자: 스트리밍 실행
          setIsBackgroundStreaming(true);
          await streamBackgroundText(backgroundText);
          setIsBackgroundStreaming(false);
          setShowProtagonistMessage(true);
        } else {
          // 재방문자: 즉시 표시
          setStreamingBackgroundStart(backgroundText);
          setShowProtagonistMessage(true);
        }
      }
    };
    
    startBackgroundStreaming();
  }, [initialData, initPending, hasStreamedBackground, isFirstVisit]);

  const sendNovelProcessMessage = async (auto = false, input = "") => {
    if (isMessageSending) return;
    
    // 세션 검증 추가
    if (!session?.user?.id) {
      const currentUrl = typeof window !== "undefined" 
        ? window.location.pathname + window.location.search 
        : "";
      router.replace(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
    
    const aiMessageCount = messages.filter((msg) => msg.type === "ai").length
    const shouldGenerateImage = (aiMessageCount + 1) % 1 === 0
    
    try {
      setIsMessageSending(true);

      const text = auto ? "계속 진행해주세요." : input;
      if (!text) return;

      // 현재 메시지가 있는지 확인하고 story_number를 안전하게 가져오기
      const lastMessage = messages[messages.length - 1];
      const currentStoryNumber = lastMessage?.story_number ?? 0;

      // 자동 생성이든 수동 입력이든 사용자 입력 메시지는 항상 'user' 타입으로 추가
      setMessages((prev) => [
        ...prev,
        { type: 'user' as const, content: text, story_number: currentStoryNumber, user_input: text },
        { type: 'ai' as const, content: "", story_number: currentStoryNumber, user_input: text },
      ]);

      const stream = await processNovel(session, novelId, text, shouldGenerateImage);

      if (!stream?.body) {
        console.error(`[StoryProvider] ReadableStream 없음:`, stream);
        throw new Error("ReadableStream not supported.");
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let imageUrl = "";
      
      // AtomicStreamJsonParser 패턴: 이전 성공 결과 유지
      let lastSuccessfulContent = "";
      let lastSuccessfulLength = 0;
      type MessageData = {
        type: string;
        content?: string;
        story_number?: number;
        user_input?: string;
        [key: string]: unknown;
      };
      let lastSuccessfulData: MessageData | null = null;
      
      // 스로틀링을 위한 버퍼 및 타이머
      let pendingUpdate: { content: string; data: MessageData } | null = null;
      let lastUpdateTime = 0;
      const THROTTLE_MS = 200; // 200ms 간격으로 업데이트 (타이핑 효과와 조화)
      let throttleTimer: NodeJS.Timeout | null = null;
      
      // 타이핑 효과 제어
      let typingController: { cancelled: boolean; targetContent: string; typingPromise: Promise<void> | null } | null = null;
      const TYPING_DELAY_MS = 15; // 각 문자마다 15ms 지연 (타이핑 속도, 자연스러운 느낌)

      /**
       * 콘텐츠 품질 계산 함수
       * 텍스트 길이와 유효성을 기반으로 품질 점수 계산
       */
      const calculateContentQuality = (content: string): number => {
        if (!content) return 0;
        // HTML 태그 제거 후 텍스트 길이 측정 (다른 코드베이스 방식)
        const textOnly = content.replace(/<[^>]*>/g, "");
        return textOnly.length;
      };

      /**
       * 새 결과가 이전 결과보다 나은지 판단
       * 스트리밍 중에는 더 완화된 임계값 적용 (50%), 일반적으로는 80%
       */
      const isResultBetter = (
        newContent: string, 
        newLength: number, 
        threshold: number = 0.8
      ): boolean => {
        if (!lastSuccessfulContent) return true; // 첫 결과는 항상 수용
        
        const newQuality = calculateContentQuality(newContent);
        const oldQuality = calculateContentQuality(lastSuccessfulContent);
        
        // 새 데이터가 기존 데이터의 최소 threshold% 품질이어야 함
        // 또는 이전보다 크게 개선된 경우 (50자 이상 증가)
        const qualityThreshold = Math.max(oldQuality * threshold, oldQuality - 50);
        return newQuality >= qualityThreshold;
      };
      
      /**
       * 대기 중인 업데이트를 실제로 적용
       * 안전한 타이핑 효과: 추가된 부분만 한글자씩 표시
       */
      const applyPendingUpdate = () => {
        if (!pendingUpdate) return;
        
        const { content, data } = pendingUpdate;
        lastUpdateTime = Date.now();
        pendingUpdate = null;
        
        // 이전 타이핑 효과 취소 (새 콘텐츠가 왔으므로)
        if (typingController) {
          typingController.cancelled = true;
        }
        
        // 새로운 타이핑 컨트롤러 생성
        typingController = { 
          cancelled: false, 
          targetContent: content,
          typingPromise: null
        };
        const currentController = typingController;
        
        // 현재 표시된 메시지와 비교하여 추가된 부분만 타이핑
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastAiIdx = newMsgs.map(m => m.type).lastIndexOf('ai');
          if (lastAiIdx !== -1) {
            const currentDisplayedContent = newMsgs[lastAiIdx].content || "";
            
            // 실제로 변경된 경우만 업데이트 (길이가 증가하거나 내용이 다른 경우)
            if (content !== currentDisplayedContent && content.length >= currentDisplayedContent.length) {
              // 추가된 부분 추출
              const newChars = content.slice(currentDisplayedContent.length);
              
              if (newChars.length > 0) {
                // 비동기로 추가된 문자들을 순차적으로 타이핑 효과로 표시
                const typingPromise = (async () => {
                  let tempContent = currentDisplayedContent;
                  
                  for (const char of newChars) {
                    // 취소되었는지 확인
                    if (currentController.cancelled) {
                      // 취소되었으면 최신 목표 콘텐츠로 즉시 업데이트하고 종료
                      setMessages((prevMsgs) => {
                        const updatedMsgs = [...prevMsgs];
                        const aiIdx = updatedMsgs.map(m => m.type).lastIndexOf('ai');
                        if (aiIdx !== -1) {
                          updatedMsgs[aiIdx] = { 
                            type: 'ai', 
                            content: currentController.targetContent,
                            story_number: data.story_number, 
                            user_input: data.user_input, 
                            image_url: imageUrl 
                          };
                        }
                        return updatedMsgs;
                      });
                      return;
                    }
                    
                    tempContent += char;
                    setMessages((prevMsgs) => {
                      const updatedMsgs = [...prevMsgs];
                      const aiIdx = updatedMsgs.map(m => m.type).lastIndexOf('ai');
                      if (aiIdx !== -1) {
                        // 취소되었는지 다시 확인 (상태 업데이트 직전)
                        if (currentController.cancelled) {
                          updatedMsgs[aiIdx] = { 
                            type: 'ai', 
                            content: currentController.targetContent,
                            story_number: data.story_number, 
                            user_input: data.user_input, 
                            image_url: imageUrl 
                          };
                        } else {
                          updatedMsgs[aiIdx] = { 
                            type: 'ai', 
                            content: tempContent, 
                            story_number: data.story_number, 
                            user_input: data.user_input, 
                            image_url: imageUrl 
                          };
                        }
                      }
                      return updatedMsgs;
                    });
                    
                    // 각 문자마다 지연 (타이핑 효과)
                    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY_MS));
                  }
                })();
                
                currentController.typingPromise = typingPromise;
              } else {
                // 추가된 부분이 없으면 즉시 업데이트
                newMsgs[lastAiIdx] = { 
                  type: 'ai', 
                  content: content, 
                  story_number: data.story_number, 
                  user_input: data.user_input, 
                  image_url: imageUrl 
                };
              }
            }
          }
          return newMsgs;
        });
      };
      
      /**
       * 스로틀링된 메시지 업데이트 함수
       * 100ms 간격으로만 실제 상태 업데이트 수행
       */
      const throttledUpdateMessage = (content: string, messageData: MessageData) => {
        const now = Date.now();
        pendingUpdate = { content, data: messageData };
        
        // 마지막 업데이트로부터 THROTTLE_MS 이상 지났으면 즉시 업데이트
        if (now - lastUpdateTime >= THROTTLE_MS) {
          if (throttleTimer) {
            clearTimeout(throttleTimer);
            throttleTimer = null;
          }
          applyPendingUpdate();
        } else {
          // 아직 시간이 안 지났으면 타이머 설정
          if (!throttleTimer) {
            const delay = THROTTLE_MS - (now - lastUpdateTime);
            throttleTimer = setTimeout(() => {
              applyPendingUpdate();
              throttleTimer = null;
            }, delay);
          }
        }
      };

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        const chunkValue = decoder.decode(value || new Uint8Array(), {
          stream: !done,
        });
        
        buffer += chunkValue;

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            
            if (dataStr === "[DONE]") {
              // 스트리밍 종료 시 대기 중인 업데이트 즉시 적용
              if (pendingUpdate) {
                applyPendingUpdate();
              }
              if (throttleTimer) {
                clearTimeout(throttleTimer);
                throttleTimer = null;
              }
              break;
            }

            // JSON 파싱 에러 처리 추가
            let data;
            try {
              data = JSON.parse(dataStr);
            } catch (parseError) {
              // JSON 파싱 실패 시 이전 성공 결과 유지
              console.warn(`[StoryProvider] JSON 파싱 실패, 이전 결과 유지:`, parseError);
              if (lastSuccessfulData) {
                data = lastSuccessfulData;
              } else {
                continue; // 첫 파싱 실패면 건너뛰기
              }
            }

            if (data.type === "story") {
              // <E> 토큰 필터링 (완전한 토큰과 불완전한 토큰 모두 제거)
              const originalContent: string = (data.content as string) || "";
              const filteredContent: string = originalContent
                .replace(/<E[^>]*>/g, '')  // 완전한 <E> 토큰 제거
                .replace(/<E[^>]*$/g, '')  // <E로 시작하는 불완전한 토큰 제거
                .replace(/<E$/g, '');      // <E로 끝나는 경우 제거
              
              const newLength = filteredContent.length;
              
              // 스트리밍 중인지 확인 (isMessageSending 상태 사용)
              const isStreaming = isMessageSending;
              // 스트리밍 중에는 더 완화된 임계값 사용 (50%), 일반적으로는 80%
              const threshold = isStreaming ? 0.5 : 0.8;
              
              // 품질 비교: 새 결과가 이전 결과보다 나은지 확인
              if (isResultBetter(filteredContent, newLength, threshold)) {
                // 좋은 결과: 업데이트
                lastSuccessfulContent = filteredContent;
                lastSuccessfulLength = newLength;
                lastSuccessfulData = { ...data, content: filteredContent };
                
                // 스로틀링된 업데이트 사용 (150ms 간격)
                // 타이핑 효과 제거로 깜빡임 방지, 업데이트 속도 조절로 읽기 편한 속도 제공
                throttledUpdateMessage(filteredContent, data);
              } else {
                // 나쁜 결과: 이전 결과 유지 (로그만 출력)
                console.warn(
                  `[StoryProvider] 품질이 낮은 파싱 결과 무시. ` +
                  `이전 길이: ${lastSuccessfulLength}, 새 길이: ${newLength}, ` +
                  `임계값: ${threshold * 100}%`
                );
                // 이전 성공 결과 유지 (업데이트하지 않음)
              }
              

            } else if (data.type === "image") {
              imageUrl = data.image_url;
              // 즉시 상태를 업데이트하여 이미지 렌더링
              setMessages((prev) => {
                const newMsgs = [...prev];
                const lastAiIdx = newMsgs.map(m => m.type).lastIndexOf('ai');
                if (lastAiIdx !== -1) {
                  // 기존 content는 유지하면서 image_url만 추가/업데이트
                  newMsgs[lastAiIdx] = { ...newMsgs[lastAiIdx], image_url: imageUrl };
                }
                return newMsgs;
              });
            } else if (data.type === "progress") {
              setProgressRate(data.progress_rate);
              
              // 진행률 마일스톤 체크 및 이미지 생성
              const currentProgress = data.progress_rate;
              const milestones = [20, 40, 60, 80, 100];
              
              for (const milestone of milestones) {
                if (currentProgress >= milestone && !generatedProgressMilestones.has(milestone)) {
                  // 마일스톤 기록
                  setGeneratedProgressMilestones(prev => new Set([...prev, milestone]));
                  
                  // 이미지 생성 (비동기로 실행하여 스토리 진행을 방해하지 않음)
                  generateImageForProgress(milestone);
                  break; // 한 번에 하나의 마일스톤만 처리
                }
              }
            } else if (data.type === "error") {
              toast({
                variant: "destructive",
                title: TOAST_GEN_NOVEL_ERROR_TITLE,
                description: TOAST_GEN_NOVEL_ERROR_DESCRIPTION,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`[StoryProvider] processNovel 오류:`, error);
      
      if (error instanceof Error && error.message.includes('TOKEN_INSUFFICIENT')) {
        // 실패한 유저 인풋과 빈 AI 메시지 제거
        setMessages((prev) => prev.slice(0, -2));
        
        // 토큰 부족 모달 표시
        setIsTokenModalOpen(true);
      } else {
        // 다른 에러의 경우에도 실패한 메시지 제거
        setMessages((prev) => prev.slice(0, -2));
        
        toast({
          variant: "destructive",
          title: TOAST_GEN_NOVEL_ERROR_TITLE,
          description: TOAST_GEN_NOVEL_ERROR_DESCRIPTION,
        });
      }
    } finally {
      setIsMessageSending(false);
    }
  };

  const generateImageForProgress = async (milestone: number) => {
    if (!session) {
      return;
    }

    try {
      setIsGeneratingImage(true);
      
      const result = await generateImage(session, novelId);
      
      if (result.success && result.image_url) {
        
        // 보관함에 이미지 추가
        setArchivedImages(prev => [...prev, result.image_url]);
        
        toast({
          title: "이미지 생성 완료",
          description: (
            <div>
              진행률 {milestone}% 도달!
              <br />
              새로운 이미지가 보관함에 추가되었습니다.
            </div>
          ),
        });
      } else {
        console.error(`[StoryProvider] 진행률 ${milestone}% 이미지 생성 실패:`, result);
        
        toast({
          variant: "destructive",
          title: "이미지 생성 실패",
          description: "이미지 생성 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error(`[StoryProvider] 진행률 ${milestone}% 이미지 생성 오류:`, error);
      
      toast({
        variant: "destructive", 
        title: "이미지 생성 오류",
        description: "이미지 생성 중 오류가 발생했습니다.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const undoStory = async () => {
    if (!confirm("이전 대화를 취소하시겠습니까?")) return;

    try {
      const res = await undoLastStory(novelId, session?.user.id);
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.slice(0, -2)); // 유저 메시지 포함해서 2개 삭제
        if (data.progress_rate) {
          setProgressRate(data.progress_rate);
        }
        toast({
          title: TOAST_UNDO_NOVEL_SUCCESS_TITLE,
          description: TOAST_UNDO_NOVEL_SUCCESS_DESCRIPTION,
        });
      } else {
        toast({
          title: TOAST_UNDO_NOVEL_ERROR_TITLE,
          description: TOAST_UDNO_NOVEL_ERROR_DECRIPTION,
        });
      }
    } catch {
      toast({
        title: TOAST_UNDO_NOVEL_ERROR_TITLE,
        description: TOAST_UDNO_NOVEL_ERROR_DECRIPTION,
      });
    }
  };

  const fetchMoreStories = async () => {
    if (initPending || !hasMoreStories || prevFetching) return;
    
    try {
      setPrevFetching(true);
      const { has_more, stories } = await getPreviousStories(
        novelId,
        currPage
      );
      const sortedStories = stories.sort(
        (a, b) => a.story_number - b.story_number
      );
      const prevMessages: Message[] = [];
      for (const s of sortedStories) {
        if (typeof s.user_input !== "undefined")
          prevMessages.push({
            type: "user",
            content: s.user_input,
            story_number: s.story_number,
            user_input: s.user_input,
          })
        if (s.content)
          prevMessages.push({
            type: "ai",
            content: s.content,
            story_number: s.story_number,
            user_input: s.user_input,
            image_url: s.image_url, // Add image_url from previous stories
          })
      }
      setMessages((prev) => [...prevMessages, ...prev]);
      setHasMoreStories(has_more);
      setCurrPage(sortedStories[0]?.story_number ?? 0);
    } catch {
      toast({
        title: "이전 스토리 불러오기 오류",
        description: "이전 스토리를 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setPrevFetching(false);
    }
  };

  return (
    <StoryContext.Provider
      value={{
        messages,
        progressRate,
        sendNovelProcessMessage,
        undoStory,
        isMessageSending,
        title: initialData?.title ?? "",
        story: initialData?.story,
        background: initialData?.background ?? {
          start: "여러분들의 소설을 시작해보세요",
          detailedLocations: [],
        },
        has_more_stories: initialData?.has_more_stories ?? false,
        initial_stories: initialData?.initial_stories ?? [],
        oldest_story_number: initialData?.oldest_story_number ?? 0,
        isMessageError: isError,
        initError: !!initError,
        fetchMoreStories,
        currPage,
        hasMoreStories,
        initPending,
        prevFetching,
        archivedImages,
        isGeneratingImage,
        streamingBackgroundStart,
        isBackgroundStreaming,
        protagonist_name: initialData?.protagonist_name,
        showProtagonistMessage,
        isFirstVisit,
        isAutoMode,
        toggleAutoMode,
      }}
    >
      {children}
      <LoadingModal visible={initPending} />
      <TokenInsufficientModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
    </StoryContext.Provider>
  );
}

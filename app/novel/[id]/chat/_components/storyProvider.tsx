"use client";
import React, {
  createContext,
  useContext,
  useState,
} from "react";
import {
  initStory,
  InitStoryResponse,
} from "@/app/novel/[id]/chat/_api/initStory.api";
import { getPreviousStories } from "@/app/novel/[id]/chat/_api/prevStory.api";
import { processNovel } from "@/app/novel/[id]/chat/_api/process.api";
import { undoLastStory } from "@/app/novel/[id]/chat/_api/undo.api";
import { LoadingModal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/utils/supabase/authProvider";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export type Message = { type: 'user' | 'ai', content: string };

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
  scrollType: ScrollBehavior | "none";
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStoryContext() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("StoryContext를 찾을 수 없습니다.");
  }
  return context;
}

const TOAST_GEN_NOVEL_ERROR_TITLE = "소설 생성 오류";
const TOAST_GEN_NOVEL_ERROR_DESCRIPTION = "소설 생성중 오류가 발생했습니다.";
const TOAST_UNDO_NOVEL_SUCCESS_TITLE = "소설 되돌리기";
const TOAST_UNDO_NOVEL_SUCCESS_DESCRIPTION = "소설을 되돌렸습니다.";
const TOAST_UNDO_NOVEL_ERROR_TITLE = "소설 되돌리기 오류";
const TOAST_UDNO_NOVEL_ERROR_DECRIPTION = "더 되돌릴 소설이 없습니다.";

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const { id: novelId } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [progressRate, setProgressRate] = useState(0);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [currPage, setCurrPage] = useState(0);
  const [hasMoreStories, setHasMoreStories] = useState(false);
  const [scrollType, setScrollType] = useState<ScrollBehavior | "none">(
    "instant"
  );
  const [prevFectching, setPrevFetching] = useState(false);

  const {
    data: initialData,
    isPending: initPending,
    isError,
    error: initError,
  } = useQuery({
    queryKey: ["initStory", novelId],
    queryFn: async () => {
      const initSetting = await initStory(novelId);
      const restoredMessages: Message[] = [];
      for (const s of initSetting.initial_stories) {
        if (s.user_input) {
          restoredMessages.push({ type: 'user', content: s.user_input });
        }
        restoredMessages.push({ type: 'ai', content: s.content });
      }
      setMessages(restoredMessages);
      setProgressRate(initSetting.progress_rate);
      setCurrPage(initSetting.oldest_story_number);
      setHasMoreStories(initSetting.has_more_stories);
      return initSetting;
    },
  });

  const session = useSession();
  const { toast } = useToast();

  const sendNovelProcessMessage = async (auto = false, input = "") => {
    if (isMessageSending) return;
    setScrollType("smooth");
    try {
      setIsMessageSending(true);

      const text = auto ? "계속 진행해주세요." : input;
      if (!text) return;

      if (!auto) {
        setMessages((prev) => [
          ...prev,
          { type: 'user' as const, content: text },
          { type: 'ai' as const, content: "" }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: 'ai' as const, content: text },
          { type: 'ai' as const, content: "" }
        ]);
      }

      const stream = await processNovel(session, novelId, text);

      if (!stream?.body) {
        throw new Error("ReadableStream not supported.");
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let accumulatedText = "";

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
              break;
            }

            const data = JSON.parse(dataStr);

            if (data.type === "story") {
              accumulatedText += data.content;
              setMessages((prev) => {
                const newMsgs = [...prev];
                const lastAiIdx = newMsgs.map(m => m.type).lastIndexOf('ai');
                if (lastAiIdx !== -1) {
                  newMsgs[lastAiIdx] = { type: 'ai', content: accumulatedText };
                }
                return newMsgs;
              });
            } else if (data.type === "progress") {
              setProgressRate(data.progress_rate);
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
    } catch {
      toast({
        variant: "destructive",
        title: TOAST_GEN_NOVEL_ERROR_TITLE,
        description: TOAST_GEN_NOVEL_ERROR_DESCRIPTION,
      });
    } finally {
      setIsMessageSending(false);
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
    if (initPending || !hasMoreStories || prevFectching) return;
    setScrollType("none");
    try {
      setPrevFetching(true);
      const { has_more, stories } = await getPreviousStories(
        novelId,
        currPage - 3
      );
      const sortedStories = stories.sort(
        (a, b) => a.story_number - b.story_number
      );
      const prevMessages: Message[] = [];
      for (const s of sortedStories) {
        if (s.user_input) {
          prevMessages.push({ type: 'user', content: s.user_input });
        }
        prevMessages.push({ type: 'ai', content: s.content });
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
        scrollType,
        initPending,
      }}
    >
      {children}
      <LoadingModal visible={initPending} />
    </StoryContext.Provider>
  );
}

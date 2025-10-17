"use client";

import { createNovel } from "@/app/create/_api/createNovel.server";
import {
  CoverImageProvider
} from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import BackgroundSetting from "@/app/create/_pages/BackgroundDesign";
import CharactorAndPlotDesign from "@/app/create/_pages/CharactorAndPlotDesign";
import { createNovelSchema } from "@/app/create/_schema/createNovelSchema";
import { Form } from "@/components/ui/form";
import Header from "@/components/ui/header";
import { LoadingModal } from "@/components/ui/modal";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { saveImageFileToStorage } from "@/app/create/_api/imageStorage.server";
import { dataURLToWebP } from "@/utils/image";

// PageComponent는 2단계로 유지됩니다.
const PageComponent: Record<number, React.FC> = {
  0: CharactorAndPlotDesign,
  1: BackgroundSetting,
};

const SUBMIT_ERROR_TITLE = "세계관 생성 실패";

// page.tsx 내부의 로직을 담는 컴포넌트 (컨텍스트 사용 위함)
function CreateNovelPageContent() {
  const { currPage, prevButtonVisible, prevPage, capturedImageDataUrl } = usePageContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof createNovelSchema>>({
    resolver: zodResolver(createNovelSchema),
    defaultValues: {
      title: "",
      plot: "",
      characters: [],
      background: {
        start: "",
        detailedLocations: [],
      },
      ending: "happy",
      mood: [],
      cover_image_url: "",
      settings: {
        hasAdultContent: false,
        hasViolence: false,
        isPublic: false,
      },
    },
  });
  const { toast } = useToast();
  const { isPending, mutate } = useMutation({
    mutationFn: createNovel,
    onSuccess: (novelId) => router.push(`/novel/${novelId}/chat`),
    onError: (error) =>
      toast({ title: SUBMIT_ERROR_TITLE, description: error.message }),
  });

  // Zod 유효성 검사 실패 시 호출될 함수
  const onInvalid = (errors: FieldErrors<z.infer<typeof createNovelSchema>>) => {
    // 실제로 오류가 없는 경우 (빈 객체), 다른 문제일 가능성이 높음
    if (Object.keys(errors).length === 0) {
      console.warn("onInvalid called but no validation errors found. This might be a form submission issue.");
      toast({
        title: "폼 제출 오류",
        description: "알 수 없는 오류가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.",
        variant: "destructive",
      });
      return;
    }

    const errorMessages = Object.entries(errors).map(([, error]) => {
      // 직접적인 오류 메시지 (e.g., title, plot, mood)
      if (error && typeof error === "object" && "message" in error) {
        return error.message;
      }
      
      // 중첩된 객체 (e.g., background.start) 핸들링
      if (error && typeof error === "object" && !("message" in error) && !Array.isArray(error)) {
        const nestedErrors = Object.entries(error)
          .map(([, nestedError]) => {
            if (nestedError && typeof nestedError === "object" && "message" in nestedError) {
              return nestedError.message;
            }
            return null;
          })
          .filter(Boolean);
        return nestedErrors.join(", ");
      }
      
      // 배열 (e.g., characters) 핸들링
      if (Array.isArray(error)) {
        const arrayErrors = error
          .map((item) => {
            if (item && typeof item === "object") {
              const itemErrors = Object.entries(item)
                .map(
                  ([, value]) =>
                    value &&
                    typeof value === "object" &&
                    "message" in value &&
                    value.message
                )
                .filter(Boolean);
              return itemErrors.join(", ");
            }
            return null;
          })
          .filter(Boolean);
        return arrayErrors.join("\n");
      }
      return null;
    });

    const combinedMessage = errorMessages.filter(Boolean).join("\n");

    toast({
      title: "입력 값에 오류가 있습니다",
      description: (
        <div className="text-left">
          {combinedMessage.split('\n').map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
      ),
      variant: "destructive",
    });
  };

  const onSubmit = async (data: z.infer<typeof createNovelSchema>) => {
    try {
      // 이 함수는 handleSubmit에 의해 유효성 검사를 통과한 경우에만 호출됩니다.
      if (!capturedImageDataUrl) {
        toast({
          title: SUBMIT_ERROR_TITLE,
          description: "표지 이미지가 준비되지 않았습니다. 이전 단계에서 표지를 설정해주세요.",
          variant: "destructive",
        });
        return;
      }

      const imageFile = await dataURLToWebP(capturedImageDataUrl, "coverImage", 0.9);
      const coverImageUrl = await saveImageFileToStorage(imageFile);

      const updatedCharacters = await Promise.all(
        data.characters.map(async (character) => {
          if (character.image_file instanceof File) {
            const imageUrl = await saveImageFileToStorage(character.image_file);
            return {
              ...character,
              asset_url: imageUrl,
              image_file: undefined,
            };
          }
          return character;
        })
      );
      
      mutate({ ...data, characters: updatedCharacters, cover_image_url: coverImageUrl });

    } catch (error) {
      console.error("세계관 생성 중 오류:", error);
      let description = "세계관 생성 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        // 파일 크기 관련 에러인 경우 사용자 친화적인 메시지로 변경
        if (error.message.includes("Body exceeded") || error.message.includes("limit")) {
          description = "파일 크기가 너무 큽니다! 이미지 파일들을 압축한 후 다시 시도해주세요.";
        } else {
          description = error.message;
        }
      }
      toast({
        title: SUBMIT_ERROR_TITLE,
        description: description,
        variant: "destructive",
      });
    }
  };

  const CurrentPageComponent = PageComponent[currPage];

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="h-full flex flex-col">
          <Header
            prevPageButton={false}
            title="나만의 세계관 만들기"
            icon={<PencilLine />}
          >
            {prevButtonVisible && (
              <ChevronLeft
                className="absolute left-5 top-1/2 -translate-y-1/2 cursor-pointer"
                size={32}
                onClick={prevPage}
              />
            )}
          </Header>
          <div className="flex-grow overflow-y-auto">
            {CurrentPageComponent && <CurrentPageComponent />}
          </div>
        </form>
      </Form>
      <LoadingModal visible={isPending} />
    </React.Fragment>
  );
}

// 최상위 export default 함수에서 CoverImageProvider를 렌더링
export default function CreateNovel() {
  return (
    <CoverImageProvider>
      <CreateNovelPageContent />
    </CoverImageProvider>
  );
}

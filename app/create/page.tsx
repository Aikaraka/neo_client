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
    console.error("Form validation failed:", errors);
    // 가장 첫번째 에러 메시지를 사용자에게 보여줍니다.
    const firstError = Object.values(errors)[0];
    // 필드 이름이 아닌 실제 에러 메시지를 찾기 위한 추가적인 탐색
    let message = "입력 내용을 다시 확인해주세요.";
    if (typeof firstError === 'object' && firstError !== null && 'message' in firstError) {
      message = firstError.message as string;
    }

    toast({
      title: "입력 값 오류",
      description: message,
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
        description = error.message;
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

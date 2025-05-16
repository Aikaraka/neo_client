"use client";

import { createNovel } from "@/app/create/_api/createNovel.server";
import {
  CoverImageProvider,
  useCoverImageContext,
} from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import BackgroundSetting from "@/app/create/_pages/BackgroundDesign";
import CharactorAndPlotDesign from "@/app/create/_pages/CharactorAndPlotDesign";
import { createNovelSchema } from "@/app/create/_schema/createNovelSchema";
import { Form } from "@/components/ui/form";
import Header from "@/components/ui/header";
import { LoadingModal } from "@/components/ui/modal";
import { PageProvider, usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { saveBase64ToStorage } from "@/app/create/_api/imageStorage.server";

// PageComponent는 2단계로 유지됩니다.
const PageComponent: Record<number, React.FC<any>> = {
  0: CharactorAndPlotDesign,
  1: BackgroundSetting,
};

const SUBMIT_ERROR_TITLE = "소설 생성 실패";

// page.tsx 내부의 로직을 담는 컴포넌트 (컨텍스트 사용 위함)
function CreateNovelPageContent() {
  const { currPage, prevButtonVisible, prevPage, capturedImageDataUrl } = usePageContext();
  const { isImageManuallySet } = useCoverImageContext();
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
    onSuccess: (novelId) => router.push(`/novel/${novelId}/detail`),
    onError: (error) =>
      toast({ title: SUBMIT_ERROR_TITLE, description: error.message }),
  });

  const onSubmit = async (data: z.infer<typeof createNovelSchema>) => {
    if (typeof window === "undefined") return;

    if (!capturedImageDataUrl) {
      toast({
        title: SUBMIT_ERROR_TITLE,
        description: "표지 이미지가 준비되지 않았습니다. 이전 단계에서 표지를 설정해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const coverImageUrl = await saveBase64ToStorage(capturedImageDataUrl);

      mutate({ ...data, cover_image_url: coverImageUrl });
    } catch (error: any) {
      console.error("소설 생성 중 에러:", error);
      toast({
        title: SUBMIT_ERROR_TITLE,
        description: error.message || "소설 생성 중 알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const CurrentPageComponent = PageComponent[currPage];

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
          <Header
            prevPageButton={false}
            title="나만의 소설 만들기"
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

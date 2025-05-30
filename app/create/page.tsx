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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { saveImageFileToStorage } from "@/app/create/_api/imageStorage.server";
import { dataURLToFile } from "@/utils/image";

// PageComponent는 2단계로 유지됩니다.
const PageComponent: Record<number, React.FC> = {
  0: CharactorAndPlotDesign,
  1: BackgroundSetting,
};

const SUBMIT_ERROR_TITLE = "소설 생성 실패";

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
    onSuccess: (novelId) => router.push(`/novel/${novelId}/detail`),
    onError: (error) =>
      toast({ title: SUBMIT_ERROR_TITLE, description: error.message }),
  });

  const onSubmit = async (data: z.infer<typeof createNovelSchema>) => {
    try {
      // 폰트가 모두 로드될 때까지 기다립니다. (캡처는 CharactorAndPlotDesign에서 이미 수행)
      // await document.fonts.ready; // 이 부분은 최종 제출 시점이므로 캡처와 직접적 관련 X, 필요시 유지

      if (!capturedImageDataUrl) {
        toast({
          title: SUBMIT_ERROR_TITLE,
          description: "표지 이미지가 준비되지 않았습니다. 이전 단계에서 표지를 설정해주세요.",
          variant: "destructive",
        });
        return;
      }

      // CharactorAndPlotDesign에서 이미 캡처된 imageDataUrl 사용
      // const editorElement = document.getElementById("cover-image-editor"); -- 삭제
      // if (!editorElement) { -- 삭제
      //   toast({ -- 삭제
      //     title: SUBMIT_ERROR_TITLE, -- 삭제
      //     description: "표지 편집기 요소를 찾을 수 없습니다.", -- 삭제
      //     variant: "destructive", -- 삭제
      //   }); -- 삭제
      //   return; -- 삭제
      // } -- 삭제

      // const imageDataUrl = await htmlToImage.toPng( -- 삭제
      //   editorElement, -- 삭제
      //   { width: 210, height: 270 } -- 삭제
      // ); -- 삭제
      
      const imageFile = dataURLToFile(capturedImageDataUrl, "coverImage.png");
      const coverImageUrl = await saveImageFileToStorage(imageFile);

      const isValid = await form.trigger();
      if (isValid) {
        mutate({ ...data, cover_image_url: coverImageUrl });
      } else {
        console.log("Form validation failed:", form.formState.errors);
        toast({
          title: "입력 값 오류",
          description: "입력 내용을 다시 확인해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("소설 생성 중 오류:", error);
      let description = "소설 생성 중 오류가 발생했습니다.";
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

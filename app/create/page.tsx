"use client";

import { createNovel } from "@/app/create/_api/createNovel.server";
import { CoverImageProvider } from "@/app/create/_components/coverImageEditor/CoverImageProvider";
import BackgroundSetting from "@/app/create/_pages/BackgroundDesign";
import CharactorAndPlotDesign from "@/app/create/_pages/CharactorAndPlotDesign";
import CoverDesign from "@/app/create/_pages/CoverDesign";
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
import * as htmlToImage from "html-to-image";
import { saveImageFileToStorage } from "@/app/create/_api/imageStorage.server";
import { dataURLToFile } from "@/utils/image";

const PageComponent: Record<number, () => JSX.Element> = {
  0: () => <CharactorAndPlotDesign />,
  1: () => <BackgroundSetting />,
  2: () => <CoverDesign />,
};

const SUBMIT_ERROR_TITLE = "소설 생성 실패";

export default function CreateNovel() {
  const { currPage } = usePageContext();
  const router = useRouter();
  const { prevButtonVisible, prevPage } = usePageContext();
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
    if (typeof window !== "undefined" && !window.isImageManuallySet) {
      toast({
        title: "표지 이미지 필요",
        description: "표지 이미지를 업로드하거나 AI로 생성해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageDataUrl = await htmlToImage.toPng(
        document.getElementById("cover-image-editor") as HTMLDivElement,
        { width: 210, height: 270 }
      );
      const imageFile = dataURLToFile(imageDataUrl, "coverImage.png");
      const coverImageUrl = await saveImageFileToStorage(imageFile);

      const possible = await form.trigger();
      if (possible) {
        mutate({ ...data, cover_image_url: coverImageUrl });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: SUBMIT_ERROR_TITLE,
        description: "소설 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CoverImageProvider>
            <Header
              prevPageButton={false}
              title="나만의 소설 만들기"
              icon={<PencilLine />}
            >
              {prevButtonVisible && (
                <ChevronLeft
                  className="absolute left-5 top-5"
                  size={32}
                  onClick={prevPage}
                />
              )}
            </Header>
            {PageComponent[currPage]()}
          </CoverImageProvider>
        </form>
      </Form>
      <LoadingModal visible={isPending} />
    </React.Fragment>
  );
}

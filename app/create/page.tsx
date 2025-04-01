"use client";

import { createNovel } from "@/app/create/_api/createNovel.server";
import BackgroundSetting from "@/app/create/_pages/BackgroundDesign";
import CharactorAndPlotDesign from "@/app/create/_pages/CharactorAndPlotDesign";
import CoverDesign from "@/app/create/_pages/CoverDesign";
import { createNovelSchema } from "@/app/create/_schema/createNovelSchema";
import { Form } from "@/components/ui/form";
import { LoadingModal } from "@/components/ui/modal";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PageComponent: Record<number, () => JSX.Element> = {
  0: () => <CharactorAndPlotDesign />,
  1: () => <BackgroundSetting />,
  2: () => <CoverDesign />,
};

const SUBMIT_ERROR_TITLE = "소설 생성 실패";

export default function CreateNovel() {
  const { currPage } = usePageContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof createNovelSchema>>({
    resolver: zodResolver(createNovelSchema),
    defaultValues: {
      background: {
        start: "",
        detailedLocations: [],
      },
      characters: [],
      ending: "happy",
      mood: [],
      plot: "",
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
    const possible = await form.trigger();
    if (possible) {
      mutate(data);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {PageComponent[currPage]?.()}
        </form>
      </Form>
      <LoadingModal visible={isPending} />
    </>
  );
}

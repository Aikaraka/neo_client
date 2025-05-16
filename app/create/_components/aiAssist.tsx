import {
  AIAssistRequest,
  postAIAssist,
} from "@/app/create/_api/aiAssist.server";
import {
  CreateNovelForm,
  CreateNovelFormFieldName,
} from "@/app/create/_schema/createNovelSchema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { HTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface AiAssistButtonProps extends HTMLAttributes<HTMLButtonElement> {
  targetField: AIAssistRequest['targetField'];
  characterIndex?: AIAssistRequest['characterIndex'];
  relationshipIndex?: AIAssistRequest['relationshipIndex'];
}

export default function AiAssistButton({
  targetField,
  characterIndex,
  relationshipIndex,
  ...restProps
}: AiAssistButtonProps) {
  const { setValue, getValues } = useFormContext<CreateNovelForm>();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: postAIAssist,
    onSuccess: ({ content }) => {
      switch (targetField) {
        case "characters":
          const characters = getValues("characters");
          if (characterIndex !== undefined && characters[characterIndex]) {
            characters[characterIndex].description = content as string;
            setValue("characters", characters);
          }
          return;
        case "relationships":
          const currentCharacters = getValues("characters");
          if (
            characterIndex !== undefined &&
            currentCharacters[characterIndex] &&
            relationshipIndex !== undefined &&
            currentCharacters[characterIndex].relationships[relationshipIndex]
          ) {
            currentCharacters[characterIndex].relationships[
              relationshipIndex
            ].relationship = content as string;
            setValue("characters", currentCharacters);
          }
          return;
      }
      setValue(
        targetField as Partial<CreateNovelFormFieldName>,
        content as string
      );
    },
    onError: () =>
      toast({
        title: "AI 어시스턴트 오류",
        description: "AI 어시스턴트 요청에 실패했습니다.",
        variant: "destructive",
      }),
  });

  function assistFieldValue() {
    const request: AIAssistRequest = {
      formData: getValues(),
      targetField,
      characterIndex: targetField === "characters" || targetField === "relationships" ? characterIndex : undefined,
      relationshipIndex: targetField === "relationships" ? relationshipIndex : undefined,
    };
    if (targetField === "plot") {
      if (request.formData.plot.length < 10) {
        toast({
          title: "AI 어시스턴트 오류",
          description: "줄거리가 너무 짧습니다.",
          variant: "destructive",
        });
        return;
      }
    }
    mutate(request);
  }

  return (
    <Button
      type="button"
      variant={"ghost"}
      onClick={assistFieldValue}
      disabled={isPending}
      {...restProps}
    >
      <Sparkles />
      {isPending ? "생성중" : "AI 보정"}
    </Button>
  );
}

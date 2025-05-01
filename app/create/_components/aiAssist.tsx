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
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { HtmlHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

export default function AiAssistButton({
  targetField,
  ...props
}: Omit<AIAssistRequest, "formData"> & HtmlHTMLAttributes<HTMLButtonElement>) {
  const { setValue, getValues } = useFormContext<CreateNovelForm>();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: postAIAssist,
    onSuccess: ({ content }) => {
      switch (targetField) {
        case "characters":
          const characters = getValues("characters");
          characters[props.characterIndex ?? 0].description = content as string;
          setValue("characters", characters);
          return;
        case "relationships":
          const relationships = getValues("characters");
          relationships[props.characterIndex ?? 0].relationships[
            props.relationshipIndex ?? 0
          ].relationship = content as string;
          setValue("characters", relationships);
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
    };
    switch (targetField) {
      case "plot":
        if (request.formData.plot.length < 10) {
          toast({
            title: "AI 어시스턴트 오류",
            description: "줄거리가 너무 짧습니다.",
            variant: "destructive",
          });
          return;
        }
      case "characters":
        request.characterIndex = props.characterIndex;
        break;
      case "relationships":
        request.relationshipIndex = props.relationshipIndex;
        break;
      default:
        break;
    }
    mutate(request);
  }

  return (
    <Button
      type="button"
      className={`${props.className} hover:bg-transparent`}
      variant={"ghost"}
      onClick={assistFieldValue}
      disabled={isPending}
      {...props}
    >
      <Sparkles />
      {isPending ? "생성중" : "AI 보정"}
    </Button>
  );
}

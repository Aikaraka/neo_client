import { signupFormSchema } from "@/app/(auth)/signup/schema";
import {
  checkEmailDuplication,
  saveToUserTable,
  signup,
} from "@/app/(auth)/signup/actions";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

export function useSignupForm() {
  const { toast } = useToast();
  const { nextPage } = usePageContext();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      terms: false,
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    const { email, password } = values;
    try {
      const { count } = await checkEmailDuplication(email);
      if (count) {
        form.setError("email", { message: "중복된 이메일입니다." });
        return;
      }
      const { authData } = await signup({ email, password });
      nextPage();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "오류 안내",
          description: error.message,
        });
      }
      toast({
        title: "오류 안내",
        description: "서버 상의 오류가 발생했습니다.",
      });
    }
  }
  const { mutate: submit, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof signupFormSchema>) => onSubmit(values),
  });

  return {
    form,
    submit,
    isPending,
  };
}

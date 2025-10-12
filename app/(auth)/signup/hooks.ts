import { signupFormSchema } from "@/app/(auth)/signup/schema";
import { signup } from "@/app/(auth)/signup/actions";
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
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof signupFormSchema>) => {
      const { email, password } = values;

      
      // 중복 체크를 제거하고 바로 signup 진행
      // Supabase Auth가 자체적으로 중복 체크를 수행함
      const { error } = await signup({ email, password });
      
      if (error) {
        // error 객체가 있으면 Error 인스턴스로 변환하여 throw
        if (typeof error === 'object' && 'message' in error) {
          // Supabase Auth의 중복 이메일 에러를 더 친근한 메시지로 변환
          if (error.message?.includes("User already registered") || 
              error.message?.includes("already exists")) {
            throw new Error("이미 가입된 이메일입니다. 로그인을 시도하거나 비밀번호 찾기를 이용해주세요.");
          }
          throw new Error(error.message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      nextPage(); // 성공 시에만 다음 UI로 이동
      toast({
        title: "인증 메일 발송",
        description: "가입하신 이메일 주소를 확인하여 인증을 완료해주세요.",
      });
      // 폼 초기화는 EmailSent 확인 버튼에서 수행
    },
    onError: (error: Error) => {
      console.error("Signup error occurred:", error);
      
      // 이미 인증된 사용자인 경우 홈으로 리다이렉트
      if (error.message.includes("이미 로그인된 상태입니다")) {
        toast({
          title: "안내",
          description: "이미 로그인되어 있습니다.",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        return;
      }
      
      // 실패 시 에러 메시지 표시
      toast({
        title: "회원가입 오류",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  return {
    form,
    submit: mutate,
    isPending,
  };
}

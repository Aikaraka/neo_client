import { signupFormSchema } from "@/app/(auth)/signup/schema";
import { signup, resendConfirmationEmail } from "@/app/(auth)/signup/actions";
import { usePageContext } from "@/components/ui/pageContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type SignupError = {
  message: string;
  name: string;
  email?: string;
  canResend?: boolean;
};

export function useSignupForm() {
  const { toast } = useToast();
  const { nextPage } = usePageContext();
  const [showResendModal, setShowResendModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation<
    void,
    SignupError,
    z.infer<typeof signupFormSchema>
  >({
    mutationFn: async (values) => {
      const { email, password } = values;

      const { error } = await signup({ email, password });

      if (error) {
        // 서버 액션의 에러 객체를 그대로 throw하여 onError에서 타입 추론이 가능하도록 함
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
    onError: (error) => {
      console.error("Signup error occurred:", error);

      // 미인증 사용자 - 재전송 모달 표시
      if (error.name === "EmailNotConfirmed" && error.email) {
        setPendingEmail(error.email);
        setShowResendModal(true);
        return;
      }

      // 이미 인증된 사용자인 경우 홈으로 리다이렉트
      if (error.message?.includes("이미 로그인된 상태입니다")) {
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

  // 재전송 핸들러
  const handleResendEmail = async () => {
    const result = await resendConfirmationEmail(pendingEmail);

    if (result.success) {
      toast({
        title: "인증 메일 재전송 완료",
        description: "이메일을 확인해주세요.",
      });
      setShowResendModal(false);
      nextPage(); // 이메일 확인 페이지로 이동
    } else {
      toast({
        title: "재전송 실패",
        description: result.error?.message || "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleCancelResend = () => {
    setShowResendModal(false);
    setPendingEmail("");
  };

  return {
    form,
    submit: mutate,
    isPending,
    showResendModal,
    handleResendEmail,
    handleCancelResend,
  };
}

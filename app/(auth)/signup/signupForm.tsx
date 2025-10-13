"use client";

import EmailSent from "@/app/(auth)/signup/emailSent";
import { useSignupForm } from "@/app/(auth)/signup/hooks";
import UserInfoForm from "@/app/(auth)/signup/userInfoForm";
import { Form } from "@/components/ui/form";
import { usePageContext } from "@/components/ui/pageContext";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function SignupForm() {
  const { currPage } = usePageContext();
  const { 
    form, 
    submit, 
    isPending,
    showResendModal,
    handleResendEmail,
    handleCancelResend
  } = useSignupForm();

  const handleSubmit = (e: React.FormEvent) => {
    // EmailSent 페이지에서는 submit 방지
    if (currPage === 1) {
      e.preventDefault();
      return;
    }
    // 첫 페이지에서만 정상적으로 submit
    form.handleSubmit((values) => submit(values))(e);
  };

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={handleSubmit}
          >
            {currPage === 0 && <UserInfoForm isPending={isPending} />}
            {currPage === 1 && <EmailSent />}
          </form>
        </Form>
      </div>

      {/* 인증 메일 재전송 모달 */}
      <Modal
        open={showResendModal}
        switch={handleCancelResend}
        backgroundClose={false}
        type="inform"
      >
        <div className="flex flex-col items-center gap-6 p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-center">
              인증 메일 미확인
            </h3>
          </div>
          
          <p className="text-center text-gray-600 whitespace-pre-line">
            이미 가입 요청한 이메일 주소입니다.{"\n"}
            이전에 발송된 인증 메일을 확인하지 않으셨나요?{"\n\n"}
            인증 메일을 다시 전송하시겠습니까?
          </p>

          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCancelResend}
            >
              취소
            </Button>
            <Button
              type="button"
              className="flex-1 bg-neo text-white hover:bg-neo-purple/80"
              onClick={handleResendEmail}
            >
              재전송
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

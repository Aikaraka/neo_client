"use client";

import { withDrawAccount } from "@/app/(auth)/(account)/setting/withdraw/_api/withdraw";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { LoadingModal, Modal } from "@/components/ui/modal";
import { Toaster } from "@/components/ui/toaster";
import useModal from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Info, UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TOAST_WITHDRAW_ERROR_TITLE = "회원 탈퇴 오류";
const TOAST_WITHDRAW_ERROR_DESCRIPTION = "회원 탈퇴 중 오류가 발생했습니다.";
export default function WithdrawPage() {
  const [withdrawAgree, setWithdrawAgree] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { open: withDrawConfirmModal, switchModal } = useModal();
  const { toast } = useToast();
  const {
    open: withDrawSuccessModal,
    switchModal: switchWithdrawSuccessModal,
  } = useModal();
  const router = useRouter();

  const handleModal = () => {
    const input = inputRef.current?.value;
    if (input === "회원 탈퇴") {
      switchModal();
    }
  };
  const { mutate: withdraw, isPending } = useMutation({
    mutationFn: withDrawAccount,
    onSuccess: switchWithdrawSuccessModal,
    onError: () =>
      toast({
        title: TOAST_WITHDRAW_ERROR_TITLE,
        description: TOAST_WITHDRAW_ERROR_DESCRIPTION,
        variant: "destructive",
      }),
  });

  return (
    <div aria-orientation="vertical" className="w-full h-screen relative">
      <Toaster>
        <Header prevPageButton />
        <div className="p-4 w-full h-full justify-center flex flex-col">
          <div className="p-4">
            <UserRoundX
              width={45}
              height={45}
              color="orange"
              className="mb-3"
            />
            <h1 className="text-xl font-bold">회원 탈퇴</h1>
          </div>
          <div className="p-4 rounded-lg bg-input flex items-center mb-5">
            <Info width={30} height={30} color="gray" />
            <div className="text-sm">
              <p className="p-2">
                회원 탈퇴를 진행하기 전에 아래 내용을 확인해 주세요.
              </p>
              <ul className="list-disc list-inside text-gray-600 gap-2 flex flex-col p-4">
                <li>
                  회원 탈퇴 시 계정 및 개인 정보가 삭제되며, 복구가
                  불가능합니다.
                </li>
                <li>
                  탈퇴 후에도 법적 보관 의무가 있는 데이터는 관련 법령에 따라
                  일정 기간 보관될 수 있습니다.
                </li>
                <li>
                  회원이 생성한 소설은 삭제되지 않을 수 있으며, 탈퇴 전에 직접
                  삭제해 주세요.
                </li>
                <li>
                  탈퇴 후 동일한 이메일 주소로 재가입이 가능하지만, 이전 계정의
                  데이터는 복원되지 않습니다.
                </li>
              </ul>
            </div>
          </div>
          {withdrawAgree ? (
            <div className="flex flex-col gap-4">
              <Input
                placeholder={`회원 탈퇴를 원하시면 "회원 탈퇴"라고 적어주세요.`}
                ref={inputRef}
              />
              <Button
                variant={"outline"}
                className="p-6 bg-orange-400 text-white hover:bg-orange-500"
                onClick={handleModal}
              >
                계정 삭제
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p>탈퇴를 계속 진행하시겠습니까?</p>
              <Button
                variant={"destructive"}
                className="p-6"
                onClick={() => setWithdrawAgree(true)}
              >
                회원 탈퇴하기
              </Button>
            </div>
          )}
        </div>
        <Modal
          type="confirm"
          open={withDrawConfirmModal}
          switch={switchModal}
          onConfirm={withdraw}
        >
          <p>정말 회원탈퇴 하시겠습니까?</p>
          <p>보고 싶을 거예요 😭</p>
        </Modal>
        <Modal
          type="inform"
          open={withDrawSuccessModal}
          switch={switchWithdrawSuccessModal}
          onConfirm={() => router.push("/")}
        >
          <p className="text-center">회원탈퇴가 완료되었습니다.</p>
          <p className="text-center">
            그동안 네오를 사랑해주셔서 감사합니다.
            <br />
            다음에 또 뵐 기회가 있으면 좋겠네요!
          </p>
        </Modal>
        <LoadingModal visible={isPending} />
      </Toaster>
    </div>
  );
}

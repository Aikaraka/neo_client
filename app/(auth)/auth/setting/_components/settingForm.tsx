import {
  MarketingAgreement,
  PrivacyPolicyAgreement,
  TermsOfServiceAgreement,
} from "@/components/agreements";
import DatePicker from "@/app/(auth)/auth/setting/_components/datePicker";
import {
  SettingFormFieldName,
  SettingFormType,
} from "@/app/(auth)/auth/setting/_schema";
import { Button } from "@/components/ui/button";
import { InputFormField, useValidation } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import * as Radio from "@radix-ui/react-radio-group";
import { Mail, User } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

export default function SettingForm({ isPending }: { isPending: boolean }) {
  const { control } = useFormContext<SettingFormType>();
  const { open: agreementModal, switchModal, message, setMessage } = useModal();

  const canProceed = useValidation<SettingFormFieldName>(
    "birth",
    "name",
    "nickname",
    "privacyPolicyAgreement",
    "termsOfServiceAgreement"
  );

  function handleAgreementModal(agreement: SettingFormFieldName) {
    switch (agreement) {
      case "termsOfServiceAgreement":
        setMessage(<TermsOfServiceAgreement />);
        break;
      case "privacyPolicyAgreement":
        setMessage(<PrivacyPolicyAgreement />);
        break;
      case "marketingAgreement":
        setMessage(<MarketingAgreement />);
        break;
      default:
        setMessage("");
        break;
    }
    switchModal();
  }

  return (
    <div className="px-8 flex flex-col gap-5">
      <InputFormField
        control={control}
        name="name"
        placeHolder="이름"
        icon={<User />}
      />
      <InputFormField
        control={control}
        name="nickname"
        placeHolder="닉네임"
        icon={<Mail />}
      />
      <div className="flex items-center gap-2 px-2 justify-between">
        생년월일
        <DatePicker name="birth" />
      </div>
      <div className="flex justify-between items-center px-2">
        성별
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <Radio.Root
              className="flex gap-2"
              value={value || ""}
              onValueChange={onChange}
            >
              <Radio.Item
                value="남성"
                className="py-2 px-5 border border-muted rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                남성
              </Radio.Item>
              <Radio.Item
                value="여성"
                className="py-2 px-5 border border-muted rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                여성
              </Radio.Item>
              <Radio.Item
                value="알 수 없음"
                className="py-2 px-5 border border-muted rounded-lg transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              >
                알 수 없음
              </Radio.Item>
            </Radio.Root>
          )}
        />
      </div>
      <div>
        <InputFormField
          control={control}
          name="termsOfServiceAgreement"
          type="checkbox"
        >
          <p className="w-full flex items-center ml-2">
            <span
              className="text-primary"
              onClick={() => handleAgreementModal("termsOfServiceAgreement")}
            >
              이용 약관
            </span>
            에 동의합니다.
          </p>
        </InputFormField>
        <InputFormField
          control={control}
          name="privacyPolicyAgreement"
          type="checkbox"
          className="h-8"
        >
          <p className="w-full flex items-center ml-2">
            <span
              className="text-primary"
              onClick={() => handleAgreementModal("privacyPolicyAgreement")}
            >
              개인정보처리방침
            </span>
            에 동의합니다.
          </p>
        </InputFormField>
        <InputFormField
          control={control}
          name="marketingAgreement"
          type="checkbox"
        >
          <p className="w-full flex items-center ml-2">
            <span
              className="text-primary"
              onClick={() => handleAgreementModal("marketingAgreement")}
            >
              마케팅 이용 약관
            </span>
            에 동의합니다.
          </p>
        </InputFormField>
      </div>
      <div className="absolute bottom-20 w-full px-8 left-0">
        <Button
          className="w-full bg-neo text-base p-6 disabled:bg-background"
          disabled={!canProceed || isPending}
        >
          계정 생성 완료
        </Button>
      </div>
      <Modal
        open={agreementModal}
        switch={switchModal}
        backgroundClose
        type="inform"
      >
        {message}
      </Modal>
    </div>
  );
}

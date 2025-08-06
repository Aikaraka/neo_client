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
import { Checkbox } from "@/components/ui/checkbox";
import { InputFormField, useValidation } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { AtSign, User } from "lucide-react";
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
    <div className="flex flex-col h-full pt-10 px-8">
      <div className="flex-grow overflow-y-auto pb-10 pr-4 -mr-4">
        <div className="flex flex-col gap-y-6">
          <InputFormField
            control={control}
            name="name"
            placeHolder="이름"
            icon={<User />}
            className="bg-white"
          />
          <InputFormField
            control={control}
            name="nickname"
            placeHolder="닉네임"
            icon={<AtSign />}
            className="bg-white"
          />
          <div className="flex items-center gap-2 px-2 justify-between">
            생년월일
            <DatePicker name="birth" />
          </div>
          <div className="flex justify-between items-center px-2">
            <p>성별</p>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <div className="flex gap-2">
                  {(["남성", "여성", "알 수 없음"] as const).map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <Checkbox
                        id={gender}
                        checked={value === gender}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onChange(gender);
                          }
                        }}
                      />
                      <Label
                        htmlFor={gender}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {gender}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
          <div className="space-y-3">
            <Controller
              control={control}
              name="termsOfServiceAgreement"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span
                      className="text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAgreementModal("termsOfServiceAgreement");
                      }}
                    >
                      이용 약관
                    </span>
                    에 동의합니다.<span className="ml-1 text-xs text-gray-400">(필수)</span>
                  </Label>
                </div>
              )}
            />
            <Controller
              control={control}
              name="privacyPolicyAgreement"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="privacy"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span
                      className="text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAgreementModal("privacyPolicyAgreement");
                      }}
                    >
                      개인정보처리방침
                    </span>
                    에 동의합니다.<span className="ml-1 text-xs text-gray-400">(필수)</span>
                  </Label>
                </div>
              )}
            />
            <Controller
              control={control}
              name="marketingAgreement"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="marketing"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span
                      className="text-primary cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAgreementModal("marketingAgreement");
                      }}
                    >
                      마케팅 이용 약관
                    </span>
                    에 동의합니다.<span className="ml-1 text-xs text-gray-400">(선택)</span>
                  </Label>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="form-action py-5">
        <Button
          className={`w-full bg-neo text-white hover:bg-neo-purple/80 ${
            canProceed ? "opacity-100" : "opacity-50 cursor-not-allowed"
          }`}
          type="submit"
          disabled={!canProceed || isPending}
        >
          {isPending ? "계정 생성 중..." : "계정 생성 완료"}
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

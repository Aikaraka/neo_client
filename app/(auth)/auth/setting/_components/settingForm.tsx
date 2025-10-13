import {
  MarketingAgreement,
  PrivacyPolicyAgreement,
  TermsOfServiceAgreement,
} from "@/components/agreements";
import DatePicker from "@/app/(auth)/auth/setting/_components/datePicker";
import {
  SettingFormFieldName,
  SettingFormType,
  calculateAge,
} from "@/app/(auth)/auth/setting/_schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputFormField, useValidation } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import useModal from "@/hooks/use-modal";
import { AtSign, User, AlertCircle } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useMemo } from "react";

export default function SettingForm({ isPending }: { isPending: boolean }) {
  const { control, watch, formState: { errors } } = useFormContext<SettingFormType>();
  const { open: agreementModal, switchModal, message, setMessage } = useModal();
  
  // 생년월일 값 실시간 감시
  const birthValue = watch("birth");
  
  // 만 나이 계산 및 경고 표시 여부
  const ageWarning = useMemo(() => {
    if (!birthValue || birthValue.length !== 8) return null;
    
    const age = calculateAge(birthValue);
    if (age < 14) {
      return `만 ${age}세는 회원가입이 불가능합니다. (만 14세 이상 가능)`;
    }
    return null;
  }, [birthValue]);

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
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 justify-between">
              생년월일
              <DatePicker name="birth" />
            </div>
            {/* 만 14세 미만 경고 메시지 */}
            {ageWarning && (
              <div className="flex items-center gap-2 px-2 py-2 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{ageWarning}</p>
              </div>
            )}
            {/* 폼 검증 에러 메시지 */}
            {errors.birth && !ageWarning && (
              <div className="flex items-center gap-2 px-2 py-2 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-600">{errors.birth.message}</p>
              </div>
            )}
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

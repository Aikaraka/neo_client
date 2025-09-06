"use client";

import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/utils/supabase/client";
import Image from "next/image";

const loginType = {
  google: {
    name: "구글",
    image: "/auth/google_emblem.svg",
    className: "bg-white text-black hover:bg-gray-50",
  },
  kakao: {
    name: "카카오",
    image: "/auth/kakao_emblem.svg",
    className: "bg-[#FEE500] text-black hover:bg-[#FEE500]/90",
  },
} as const;

type SocialLoginButtonType = {
  type: keyof typeof loginType;
};
export default function SocialLoginButton({ type }: SocialLoginButtonType) {
  const { image, name, className } = loginType[type];

  return (
    <Button
      variant="outline"
      className={`w-full p-6 rounded-lg text-base font-normal flex items-center justify-center gap-2 ${className}`}
      type="button"
      onClick={() => signInWithOAuth(type)}
    >
      <Image src={image} alt={type} width={22} height={22} />
      <span>{name} 로그인</span>
    </Button>
  );
}

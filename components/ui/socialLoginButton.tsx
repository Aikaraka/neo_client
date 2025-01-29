"use client";

import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/utils/supabase/client";
import Image from "next/image";

const loginType = {
  google: {
    name: "구글",
    image: "/auth/google_emblem.svg",
  },
  kakao: { name: "카카오", image: "/auth/kakao_emblem.svg" },
} as const;

type SocialLoginButtonType = {
  type: keyof typeof loginType;
};
export default function SocialLoginButton({ type }: SocialLoginButtonType) {
  const { image, name } = loginType[type];

  return (
    <Button
      variant="outline"
      className="w-full p-6 rounded-lg text-base font-normal"
      type="button"
      onClick={() => signInWithOAuth(type)}
    >
      <Image src={image} alt={type} width={26} height={26} />
      {name} 로그인
    </Button>
  );
}

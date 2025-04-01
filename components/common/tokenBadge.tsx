"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/utils/supabase/authProvider";
import { getUserToken } from "@/utils/supabase/service/token.server";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TokenBadge() {
  const user = useUser();
  const router = useRouter();
  if (!user)
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 text-sm"
        onClick={() => router.push("/login")}
      >
        <Lock />
        로그인
      </Button>
    );

  return <Token />;
}

function Token() {
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: getUserToken,
  });
  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 h-6"
    >
      <Image
        src="/header/diamond.svg"
        alt="token icon"
        height={10}
        width={10}
      />
      {token ?? 0}
    </Button>
  );
}

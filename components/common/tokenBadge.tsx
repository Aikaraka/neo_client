"use client";

import { useUser } from "@/utils/supabase/authProvider";
import { getUserToken } from "@/utils/supabase/service/token.server";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function TokenBadge() {
  const user = useUser();
  const router = useRouter();
  if (!user)
    return (
      <button
        onClick={() => router.push("/login")}
        className="text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        로그인
      </button>
    );

  return <Token />;
}

function Token() {
  const router = useRouter();
  const { data: token } = useQuery({
    queryKey: ["token"],
    queryFn: getUserToken,
  });
  return (
    <div
      onClick={() => router.push("/store")}
      className="flex items-center justify-between bg-background rounded-full p-1 h-[24px] w-auto min-w-[90px] cursor-pointer shadow-sm border-[0.5px] border-[#ACA5B1] hover:shadow-md transition-shadow"
    >
      <div className="flex items-center pl-1">
        <Image
          src="/piece.svg"
          alt="조각 아이콘"
          height={12}
          width={12}
        />
        <span className="ml-1.5 text-xs font-bold text-gray-800">
          {token ?? 0}
        </span>
      </div>
      <button className="bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-purple-600 transition-colors mr-0.5">
        <Plus size={13} />
      </button>
    </div>
  );
}

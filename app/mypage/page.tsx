import SideBar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/app/mypage/_api/currentUser.server";
import { User } from "lucide-react";
import Image from "next/image";
import { MainContent } from "@/components/ui/content";

export default async function Page() {
  const userData = await getCurrentUser();

  return (
    <div className="flex w-full h-screen justify-center items-center bg-input">
      <MainContent>
        <div className="w-full h-full max-w-4xl mx-auto p-6 flex flex-col gap-4">
          <header className="flex h-7 p-1 justify-between items-center">
            <div className="flex gap-3">
              <User size={24} />
              마이네오
            </div>
            <div className="flex items-center gap-3">
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
                {userData.token.remaining_tokens}
              </Button>
              <SideBar />
            </div>
          </header>
          <section className="flex flex-col justify-between gap-2 mt-10 pb-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Image
                  src={"/neo_emblem.svg"}
                  alt="profile image"
                  height={70}
                  width={70}
                  className="rounded-full contain-size bg-slate-300"
                />
                {userData.user.nickname}
              </div>
              <Button variant={"outline"} className="rounded-full">
                프로필 편집
              </Button>
            </div>
          </section>
          <section className="py-5 text-center">
            <p className="text-gray-600">
              당신이 창작한 소설들을 편리하게 관리하고, &ldquo;스토리&rdquo;의
            </p>
            <p className="text-gray-600">
              새로운 &ldquo;인생&rdquo;을 감상해보세요.
            </p>
          </section>
        </div>
      </MainContent>
    </div>
  );
}

import SideBar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/app/mypage/_api/currentUser.server";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MainContent } from "@/components/ui/content";

export default async function Page() {
  const userData = await getCurrentUser();

  return (
    <MainContent>
      <div className="w-full px-8 pt-10 pb-20">
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
        <section className="py-5">
          <Link href={"/create"}>
            <Button className="w-full p-6 [&_svg]:size-5" variant={"outline"}>
              <Plus className="text-primary" /> 소설 제작
            </Button>
          </Link>
        </section>
        <section>
          <p className="mb-5">내 소설</p>
          <div className="w-full grid grid-cols-3 place-items-center pb-5 gap-x-2 gap-y-4">
            {userData.novels.map((novel, index) => (
              <Link href={`/novel/${novel.id}/detail`}>
                <Card key={index} className="w-[100px] shrink-0">
                  <CardContent className="p-0">
                    <Image
                      src={
                        novel.image_url
                          ? novel.image_url
                          : "/src/public/neo_emblem.svg"
                      }
                      alt={novel.title}
                      width={150}
                      height={150}
                      className="rounded-t-lg object-cover w-[100px] h-[100px]"
                    />
                    <div className="p-2">
                      <p className="text-sm truncate">{novel.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MainContent>
  );
}

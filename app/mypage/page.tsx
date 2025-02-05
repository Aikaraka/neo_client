import SideBar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/utils/supabase/service/user";
import { Plus, User } from "lucide-react";
import Image from "next/image";

const novels = [
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
];

export default async function Page() {
  const user = await getCurrentUser();
  //   const { toggleSidebar } = useSidebar();
  return (
    <div className="w-full h-screen px-8 py-10 ">
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
            9999
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
            {user.nickname}
          </div>
          <Button variant={"outline"} className="rounded-full">
            프로필 편집
          </Button>
        </div>
        <div className="flex gap-3">
          <p>
            999<span className="font-extralight"> 팔로워</span>
          </p>
          <p>
            999 <span className="font-extralight">팔로잉</span>
          </p>
        </div>
      </section>
      <section className="py-5">
        <Button className="w-full p-6 [&_svg]:size-5" variant={"outline"}>
          <Plus className="text-primary" /> 소설 제작
        </Button>
      </section>
      <section>
        <div>내 소설</div>
        <div className="w-full grid grid-cols-3 place-items-center pb-5">
          {novels.map((novel, index) => (
            <Card key={index} className="w-[100px] shrink-0">
              <CardContent className="p-0">
                <Image
                  src={novel.image}
                  alt={novel.title}
                  width={150}
                  height={200}
                  className="rounded-t-lg object-cover"
                />
                <div className="p-2">
                  <p className="text-sm truncate">{novel.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

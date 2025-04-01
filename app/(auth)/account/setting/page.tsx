import { ScrollArea } from "@/components/layout/scroll-area";
import PrevPageButton from "@/components/ui/PrevPageButton";
import Link from "next/link";

const linkList = [
  { title: "회원 탈퇴", href: "/account/setting/withdraw" },
  { title: "비밀번호 변경", href: "/account/setting/changepassword" },
];
export default function Page() {
  return (
    <ScrollArea
      aria-orientation="vertical"
      className="w-full h-screen whitespace-nowrap pb-20 relative"
    >
      <header className="p-6 text-xl text-center border-b">
        <PrevPageButton />
        계정 설정
      </header>
      <div className="w-full flex flex-col gap-6 p-4 text-lg">
        {linkList.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="hover:text-gray-600 transition-colors p-2"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}

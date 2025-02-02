import { Button } from "@/components/ui/button";

export default function joinSetting() {
  return (
    <div className="w-full h-screen grid px-8 py-10">
      <h1 className="text-2xl font-bold self-center">
        네오와 여정을 떠나기 위한 마지막 단계입니다
      </h1>
      <div className="absolute px-8 w-full bottom-20 left-0">
        <Button className="w-full p-8 text-lg bg-neo">계정 생성 완료</Button>
      </div>
    </div>
  );
}

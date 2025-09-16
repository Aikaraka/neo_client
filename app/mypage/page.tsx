import { getCurrentUser } from "@/app/mypage/_api/currentUser.server";
import MyPageClient from "./_components/MyPageClient";

export default async function Page() {
  const userData = await getCurrentUser();

  return <MyPageClient userData={userData} />;
}

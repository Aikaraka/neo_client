import PrevPageButton from "@/components/ui/PrevPageButton";

// 임시 알림 데이터 타입
interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// 임시 알림 데이터
const initialNotifications: Notification[] = [
  {
    id: "2",
    title: "회원 가입 무료포인트",
    message: "회원 가입 기념 10포인트를 드렸습니다.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
  },
  {
    id: "1",
    title: "네오에 오신 것을 환영합니다!",
    message: "네오만의 즐거운 소설 세계관을 둘러보세요!",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
  },
];

// 시간 포맷 함수
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else {
    return `${days}일 전`;
  }
}

export default function NoticePage() {
  return (
    <div className="flex w-full h-screen bg-[#EDEFF3]">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="container mx-auto max-w-2xl py-8">
          <header className="relative flex items-center justify-center mb-10">
            <div className="absolute left-0 top-0 bottom-0 flex items-center">
              <PrevPageButton />
            </div>
            <h1 className="text-xl font-bold text-gray-800">공지사항</h1>
          </header>

          <main>
            <ul className="space-y-4">
              {initialNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-md font-bold text-gray-900">{notification.title}</h2>
                    <time className="text-sm text-gray-400 flex-shrink-0 ml-4">
                      {formatTimeAgo(notification.createdAt)}
                    </time>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {notification.message}
                  </p>
                </li>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
} 
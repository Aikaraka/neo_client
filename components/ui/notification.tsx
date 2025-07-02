import * as React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/layout/scroll-area";
import Link from "next/link";

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

// 텍스트 자르기 함수
function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// localStorage에서 읽음 상태 불러오기
function getReadNotifications(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('readNotifications');
  return stored ? JSON.parse(stored) : [];
}

// localStorage에 읽음 상태 저장하기
function saveReadNotifications(readIds: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('readNotifications', JSON.stringify(readIds));
}

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  
  // 컴포넌트 마운트 시 localStorage에서 읽음 상태 불러오기
  React.useEffect(() => {
    const readIds = getReadNotifications();
    const updatedNotifications = initialNotifications.map(notification => ({
      ...notification,
      isRead: readIds.includes(notification.id)
    }));
    setNotifications(updatedNotifications);
  }, []);
  
  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnread = unreadCount > 0;
  
  // 알림 읽음 처리
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      
      // localStorage에 읽음 상태 저장
      const readIds = updated.filter(n => n.isRead).map(n => n.id);
      saveReadNotifications(readIds);
      
      return updated;
    });
  };
  
  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      
      // localStorage에 모든 알림 읽음 상태 저장
      const allIds = updated.map(n => n.id);
      saveReadNotifications(allIds);
      
      return updated;
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "relative p-2 rounded-md hover:bg-gray-100 transition-all duration-300", 
          className
        )}>
          <Bell 
            className={cn(
              "w-5 h-5 transition-all duration-300",
              hasUnread 
                ? "text-purple-600 animate-pulse" 
                : "text-gray-500"
            )}
            style={hasUnread ? {
              filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))',
              animation: 'pulse 2s ease-in-out infinite'
            } : {}}
          />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">알림</h3>
          {hasUnread && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              모두 읽음
            </button>
          )}
        </div>
        
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              알림이 없습니다.
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className="p-0 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={cn(
                    "w-full p-4 hover:bg-gray-50 transition-colors",
                    !notification.isRead && "bg-purple-50 border-l-4 border-purple-300"
                  )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2 shrink-0",
                        !notification.isRead ? "bg-purple-600" : "bg-transparent"
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            !notification.isRead && "font-semibold text-purple-900"
                          )}>
                            {notification.title}
                          </h4>
                        </div>
                        
                        <p className={cn(
                          "text-sm mb-2 leading-relaxed",
                          !notification.isRead ? "text-purple-800" : "text-gray-600"
                        )}>
                          {truncateText(notification.message)}
                        </p>
                        
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t">
          <Link href="/notice" className="w-full text-sm text-purple-600 hover:text-purple-800 text-center transition-colors block">
            모든 알림 보기
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
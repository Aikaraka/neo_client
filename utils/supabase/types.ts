export type User = {
  id: string;
  email: string;
  created_at: string;
  auth_provider?: "email" | "google" | "kakao"; // OAuth 제공자 정보 추가
  // 필요한 추가 필드
};

export type AuthError = {
  message: string;
  status: number;
};

export type AuthResponse = {
  user: User | null;
  error: AuthError | null;
};

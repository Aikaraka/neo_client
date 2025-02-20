export type User = {
  id: string;
  email: string;
  name: string;
  auth_provider?: "email" | "google" | "kakao";
  created_at: Date;
  nickname: string;
  birthdate: string;
  gender: string;
  profile_completed: boolean;
};

export type AuthError = {
  message: string;
  status: number;
};

export type AuthResponse = {
  user: User | null;
  error: AuthError | null;
};

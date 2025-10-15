"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const supportTicketSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  category: z.string().min(1, { message: "문의 유형을 선택해주세요." }),
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  content: z.string().min(10, { message: "문의 내용은 최소 10자 이상이어야 합니다." }),
});

export async function submitSupportTicket(formData: {
  email: string;
  category: string;
  title: string;
  content: string;
}) {
  const supabase = await createClient();

  // 1. Get current authenticated user - MUST be logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: "로그인이 필요합니다.",
    };
  }

  // 2. Validate form data
  const validationResult = supportTicketSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  
  // 3. Insert into support_tickets
  const { error: insertError } = await supabase.from("support_tickets").insert({
    user_id: user.id, // UUID from authenticated user
    email: formData.email, // Email from user input
    category: formData.category,
    title: formData.title,
    content: formData.content,
  });

  if (insertError) {
    return {
      success: false,
      message: "문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  return {
    success: true,
    message: "문의가 성공적으로 제출되었습니다. 빠른 시일 내에 답변드리겠습니다.",
  };
}

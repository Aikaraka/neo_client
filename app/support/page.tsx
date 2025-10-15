"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Select from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { submitSupportTicket } from "./_api/actions";
import { useToast } from "@/hooks/use-toast";
import { useUser, useAuthLoading } from "@/utils/supabase/authProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const supportTicketSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  category: z.string().min(1, { message: "문의 유형을 선택해주세요." }),
  title: z.string().min(1, { message: "제목을 입력해주세요." }),
  content: z.string().min(10, { message: "문의 내용은 최소 10자 이상이어야 합니다." }),
});

const TICKET_CATEGORIES = [
  "계정 문의", "결제/환불", "서비스 이용", "오류/버그 신고", "콘텐츠 신고", "기타",
];

function SupportPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <Skeleton className="h-9 w-48 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto mt-4" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-36 w-full" /><Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { toast } = useToast();
  const user = useUser();
  const loading = useAuthLoading();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof supportTicketSchema>>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: { email: "", category: "", title: "", content: "" },
  });

  useEffect(() => {
    // loading이 false가 된 후에만 인증 상태를 확인
    if (!loading) {
      if (!user) {
        router.replace("/login?message=로그인이 필요한 서비스입니다.");
      } else {
        // 로그인된 사용자의 이메일로 폼 초기화
        form.reset({ 
          email: user.email || "", 
          category: "", 
          title: "", 
          content: "" 
        });
      }
    }
  }, [loading, user, router, form]);

  // 로딩 중이거나 사용자가 없으면 스켈레톤 표시
  if (loading || !user) {
    return <SupportPageSkeleton />;
  }

  async function onSubmit(values: z.infer<typeof supportTicketSchema>) {
    setIsSubmitting(true);
    const result = await submitSupportTicket(values);
    setIsSubmitting(false);
    if (result.success) {
      toast({ title: "문의 제출 성공", description: result.message });
      router.replace("/");
    } else {
      toast({ variant: "destructive", title: "제출 실패", description: result.message || "입력 내용을 다시 확인해주세요." });
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">고객 지원 센터</h1>
        <p className="text-muted-foreground mt-2">궁금한 점이나 불편한 점이 있으신가요? 언제든지 문의해주세요.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>답변 받을 이메일</FormLabel>
              <FormControl>
                <Input placeholder="답변 받을 이메일 주소를 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>문의 유형</FormLabel>
              <FormControl>
                <Select className="w-full" options={TICKET_CATEGORIES} placeholder="문의 유형을 선택하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="문의 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
              <FormLabel>문의 내용</FormLabel>
              <FormControl>
                <textarea placeholder="문의 내용을 자세하게 작성해주세요." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none" rows={8} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "제출 중..." : "문의 제출하기"}
          </Button>
        </form>
      </Form>
    </div>
  );
}


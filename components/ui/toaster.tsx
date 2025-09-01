"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

interface ToasterProps {
  children?: React.ReactNode;
}

export function Toaster({ children }: ToasterProps) {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {children}{" "}
      {/* 여기에 children을 포함시켜 다른 컴포넌트에서 사용할 수 있게 합니다. */}
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props} className="">
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
            {action && <div className="mt-2">{action}</div>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

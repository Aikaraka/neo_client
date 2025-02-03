import { Button } from "@/components/ui/button";
import React from "react";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  switch: () => void;
  onConfirm?: () => void;
  confirmText?: string;
};

export const Modal = ({
  children,
  open,
  switch: toggle,
  onConfirm,
  confirmText,
}: ModalProps) => {
  if (!open) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !onConfirm) {
      toggle();
    }
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-40"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-[80%] z-50 flex flex-col gap-5">
        {children}
        <Button type="button" onClick={onConfirm ?? toggle}>
          {confirmText ?? "확인"}
        </Button>
      </div>
    </div>
  );
};

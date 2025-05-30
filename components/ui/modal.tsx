import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  switch: () => void;
  backgroundClose?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  fixed?: boolean;
  type?: "confirm" | "inform" | "none";
};

export const Modal = ({
  children,
  open,
  switch: toggle,
  backgroundClose = true,
  onConfirm,
  confirmText,
  fixed = false,
  type = "confirm",
}: ModalProps) => {
  const displayOption = fixed ? "fixed" : "absolute";
  if (!open) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (backgroundClose) toggle();
  };

  return (
    <div
      className={`${displayOption} md:fixed absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-40`}
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-[80%] max-h-[80%] z-50 flex flex-col gap-5 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {type === "confirm" && (
          <div className="w-full flex gap-4 justify-center">
            <Button variant={"destructive"} className="w-3/4" onClick={toggle}>
              취소
            </Button>
            <Button
              variant={"default"}
              className="w-3/4"
              onClick={() => {
                if (onConfirm) onConfirm();
                toggle();
              }}
            >
              {confirmText ?? "확인"}
            </Button>
          </div>
        )}
        {type === "inform" && (
          <Button type="button" onClick={onConfirm ?? toggle}>
            {confirmText ?? "확인"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const LoadingModal = ({ visible = true }: { visible?: boolean }) => {
  if (visible)
    return (
      <div className="absolute md:fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Spinner />
      </div>
    );
};

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  switch: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  type?: "confirm" | "inform";
};

export const Modal = ({
  children,
  open,
  switch: toggle,
  onConfirm,
  confirmText,
  type = "confirm",
}: ModalProps) => {
  if (!open) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-5 flex justify-center items-center z-40"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-[80%] z-50 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        {type === "confirm" ? (
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
        ) : (
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
      <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <Spinner />
      </div>
    );
};

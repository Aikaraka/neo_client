import { useState } from "react";

export default function useModal(initialMessage?: string) {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | React.ReactNode>(
    initialMessage ?? ""
  );

  function switchModal() {
    setOpen(!open);
  }

  return {
    open,
    switchModal,
    setMessage,
    message,
  };
}

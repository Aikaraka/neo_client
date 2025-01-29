import { useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState("");

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

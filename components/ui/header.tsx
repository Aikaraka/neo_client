import PrevPageButton from "@/components/ui/PrevPageButton";
import { cn } from "@/lib/utils";
import { HtmlHTMLAttributes } from "react";

export default function Header({
  prevPageButton = false,
  title,
  ...props
}: HtmlHTMLAttributes<HTMLHeadElement> & {
  prevPageButton: boolean;
  title?: string;
}) {
  return (
    <header
      {...props}
      className={cn("p-6 text-xl text-center", props.className)}
    >
      {prevPageButton && <PrevPageButton />}
      {title}
    </header>
  );
}

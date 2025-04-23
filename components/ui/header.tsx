import PrevPageButton from "@/components/ui/PrevPageButton";
import { cn } from "@/lib/utils";
import { HtmlHTMLAttributes } from "react";

export default function Header({
  prevPageButton = false,
  title,
  icon,
  children,
  ...props
}: HtmlHTMLAttributes<HTMLHeadElement> & {
  children?: React.ReactNode;
  prevPageButton: boolean;
  title?: string;
  icon?: React.ReactNode;
}) {
  return (
    <header
      {...props}
      className={cn("p-6 text-xl text-center w-full relative", props.className)}
    >
      <div className="flex gap-3 items-center justify-center">
        {icon}
        {title}
      </div>
      {prevPageButton && <PrevPageButton className="absolute left-0 top-4" />}
      {children}
    </header>
  );
}

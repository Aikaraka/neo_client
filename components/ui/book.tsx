import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { twMerge } from "tailwind-merge";
import { cva, VariantProps } from "class-variance-authority";

type BookVariantProps = VariantProps<typeof bookVariants>;
const bookVariants = cva("", {
  variants: {
    size: {
      default: "md:w-[210px] md:h-[270px] w-[105px] h-[140px]",
      extraSmall: "w-[45px] h-[60px]",
      small: "w-[105px] h-[140px]",
      medium: "w-[126px] h-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface BookProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BookVariantProps {
  href: string;
  shadow?: boolean;
}
const Book = React.forwardRef<HTMLDivElement, BookProps>(
  ({ className, size, href, shadow = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card text-card-foreground shadow-sm shrink-0 relative z-10",
        className,
        bookVariants({ size })
      )}
      {...props}
    >
    </div>
  )
);
Book.displayName = "Book";

const BookShelf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <ScrollArea className="w-full whitespace-nowrap">
      <div className={twMerge("flex space-x-4", className)} {...props} ref={ref}>
        {props.children}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  </div>
));
BookShelf.displayName = "BookShelf";

const BookContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 z-[25]", className)} {...props} />
));
BookContent.displayName = "BookContent";

export { Book, BookShelf, BookContent };

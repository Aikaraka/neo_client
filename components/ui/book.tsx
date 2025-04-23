import * as React from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { twMerge } from "tailwind-merge";

const Book = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { href: string }
>(({ className, href, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground shadow-sm md:w-[210px] md:h-[270px] shrink-0 relative w-[105px] h-[140px]",
      className
    )}
    {...props}
  >
    <Link href={href}>
      {props.children}
      <Image
        src={"/novel/book_template.png"}
        width={180}
        height={240}
        className="absolute h-full top-0 z-20"
        alt="book_template"
      />
      <Image
        src={"/novel/book_shadow.png"}
        width={119}
        height={59}
        alt="book_shadow"
        className="absolute bottom-0 right-5 z-10"
      />
    </Link>
  </div>
));
Book.displayName = "Book";

const BookShelf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <ScrollArea className="w-full whitespace-nowrap">
    <div className={twMerge("flex space-x-4", className)} {...props} ref={ref}>
      {props.children}
    </div>
    <ScrollBar orientation="horizontal" />
    <div className="h-1/2 w-full absolute bottom-5 bg-[#dbdbdb]" />
    <div className="h-5 bg-[#F6F3F1] shadow-bookshelf " />
  </ScrollArea>
));
BookShelf.displayName = "BookShelf";

export { Book, BookShelf };

import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

type TextInputWithIconProps = React.ComponentProps<"input"> & {
  IconComponent: React.ReactNode;
};

const TextInputWithIcon = React.forwardRef<
  HTMLInputElement,
  TextInputWithIconProps
>(({ className, IconComponent, ...props }, ref) => {
  const { register } = useFormContext();
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 md:text-sm ",
        className
      )}
    >
      <input
        type="text"
        className="flex-1 inset-1 bg-transparent focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-base"
        ref={ref}
        {...props}
      />
      {IconComponent && (
        <span className="ml-4 w-6 text-muted-foreground">{IconComponent}</span>
      )}
    </div>
  );
});
TextInputWithIcon.displayName = "TextInputWithIcon";

export { TextInputWithIcon, Input };

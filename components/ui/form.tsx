"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Control,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cva } from "class-variance-authority";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);
const inputVariants = cva("", {
  variants: {
    type: {
      text: "flex h-12 w-full items-center rounded-md border border-input px-4 py-2 bg-gray-100 md:text-sm",
      checkbox: "flex h-7 w-full items-center",
      email:
        "flex h-12 w-full items-center rounded-md border border-input px-4 py-2 bg-gray-100 md:text-sm",
      default:
        "flex h-12 w-full items-center rounded-md border border-input px-4 py-2 bg-gray-100 md:text-sm",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

const InputFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  changeEffect,
  className,
  icon,
  placeHolder,
  type = "text",
  children,
  showErrorMessage = true,
}: {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  changeEffect?: (value: string) => void;
  className?: React.HTMLAttributes<HTMLInputElement>["className"];
  icon?: React.ReactNode;
  placeHolder?: string;
  type?: React.HTMLInputTypeAttribute;
  children?: React.ReactNode;
  showErrorMessage?: boolean;
}) => {
  const validTypes = ["text", "checkbox", "email", "default"];
  const variantType = validTypes.includes(type as string) ? type : "default";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              className={cn(
                inputVariants({ type: variantType as "text" | "email" | "checkbox" | "default" }),
                className
              )}
            >
              <Input
                type={type}
                {...field}
                placeholder={placeHolder ?? ""}
                onChange={(e) => {
                  field.onChange(e);
                  changeEffect?.(e.target.value);
                }}
                className="flex-1 inset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-base border-none focus-visible:ring-offset-0 focus-visible:ring-0 p-0"
              />
              {children}
              {icon && (
                <p className=" w-7 text-muted-foreground flex justify-center">
                  {icon}
                </p>
              )}
            </div>
          </FormControl>
          {showErrorMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

export function useValidation<T extends string>(...args: T[]) {
  const { getFieldState } = useFormContext();

  const validation = args.map((arg) => {
    const fieldState = getFieldState<T>(arg);
    return !fieldState.invalid && fieldState.isDirty;
  });

  return validation.every((field) => field);
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  InputFormField,
};

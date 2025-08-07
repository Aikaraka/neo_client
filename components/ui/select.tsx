import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[] | number[];
}

const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps & {
    placeholder: string;
  }
>(({ options, placeholder, className, ...props }, ref) => (
  <select 
    {...props} 
    ref={ref} 
    className={cn("border px-3 py-2 rounded", className)}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
));

Select.displayName = "Select";

export default Select;

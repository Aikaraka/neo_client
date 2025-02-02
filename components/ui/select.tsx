import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[] | number[];
}

const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps & {
    placeholder: string;
  }
>(({ options, placeholder, ...props }, ref) => (
  <select {...props} ref={ref} className="border px-3 py-2 rounded">
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

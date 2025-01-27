import * as React from "react";

interface SelectProps extends React.ComponentProps<"select"> {
  label: string;
  options: string[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ onChange, onBlur, name, label, options, ...props }, ref) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      >
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
);

Select.displayName = "Select";

export default Select;

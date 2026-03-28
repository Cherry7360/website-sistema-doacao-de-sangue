import React from "react";

const Select = React.forwardRef(
  ({ label, required, error, className = "", children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}

        <select
          ref={ref}
          {...props}
          className={`
            w-full px-4 py-2 rounded-lg
            border text-gray-700 bg-white
            focus:outline-none focus:ring-2 focus:ring-red-500
            transition
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
        >
          {children}
        </select>

        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);

export default Select;

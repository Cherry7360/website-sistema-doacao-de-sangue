import React from "react";

const Textarea = React.forwardRef(
  ({ label, name, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label className="mb-1 font-medium">{label}</label>}
        <textarea
          name={name}
          placeholder={placeholder}
          className={`border p-2 rounded ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

export default Textarea;

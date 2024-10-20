<<<<<<< HEAD
import React from "react";

const Label = ({ htmlFor = "default", children, className = "", ...props }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className={`label ${className}`} {...props}>
        {children}
      </label>
    </div>
  );
};

export default Label;
=======
import React from "react"

const Label = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
})

Label.displayName = "Label"

export default Label
>>>>>>> main

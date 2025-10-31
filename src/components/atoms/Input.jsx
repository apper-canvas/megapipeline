import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";
  
  const errorStyles = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
    : "border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400";

  return (
    <input
      type={type}
      className={cn(baseStyles, errorStyles, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
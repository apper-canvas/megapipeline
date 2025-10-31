import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ label, error, required, className, ...inputProps }) => {
  return (
    <div className={cn("space-y-1", className)}>
      <Label required={required}>{label}</Label>
      <Input error={error} {...inputProps} />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;
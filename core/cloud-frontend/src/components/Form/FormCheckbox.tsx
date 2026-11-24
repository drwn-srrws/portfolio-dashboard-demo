import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { cn } from "@/utils/utils";

export interface FormCheckboxProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label?: string;
  className?: string;
  color?: "primary" | "green";
  disabled?: boolean;
}

export const FormCheckbox = <T extends FieldValues>({
  label,
  className,
  color = "primary",
  disabled,
  ...props
}: FormCheckboxProps<T>) => {
  const { field } = useController(props);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Checkbox
        id={field.name}
        checked={field.value || false}
        onCheckedChange={field.onChange}
        color={color}
        disabled={disabled}
      />
      {label && (
        <Label
          htmlFor={field.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
      )}
    </div>
  );
};

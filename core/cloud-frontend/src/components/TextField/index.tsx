import { forwardRef, useId } from "react";

import { FormControl, FormControlProps } from "@/components/Form/FormControl";

import { Input, InputProps } from "@components/ui";

export type TextFieldProps = InputProps &
  FormControlProps & { testId?: string };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ error, required, label, helperText, tip, testId, ...props }, ref) => {
    const id = useId();

    return (
      <FormControl
        id={id}
        required={required}
        error={error}
        label={label}
        helperText={helperText}
        tip={tip}
      >
        <Input
          {...props}
          ref={ref}
          className="bg-transparent"
          id={id}
          data-testid={testId}
        />
      </FormControl>
    );
  }
);

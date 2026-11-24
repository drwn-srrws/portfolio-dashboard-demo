import { forwardRef, useId } from "react";
import { FormControl, FormControlProps } from "@/components/Form/FormControl";

import { Textarea, TextareaProps } from "@components/ui";

export type TextAreaProps = TextareaProps &
  FormControlProps & { testId?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
        <Textarea
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

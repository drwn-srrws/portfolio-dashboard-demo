import { forwardRef, useId } from "react";

import { withFormController } from "@/hocs/withFormController";
import { FormControl, FormControlProps } from "@components/Form/FormControl";
import { DatePicker as DatePickerCmp } from "@components/DatePicker";

export type FormDatePickerProps = FormControlProps & {
  testId?: string;
  placeholder?: string;
};

export const DatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ required, error, label, helperText, tip, testId, ...props }, ref) => {
    const id = useId();

    return (
      <div className="relative">
        <FormControl
          id={id}
          required={required}
          error={error}
          label={label}
          helperText={helperText}
          tip={tip}
        >
          <DatePickerCmp
            {...props}
            ref={ref}
            className="bg-transparent py-2"
            inputProps={{ "data-testid": testId }}
          />
        </FormControl>
      </div>
    );
  }
);

export const FormDatePicker = withFormController(DatePicker);

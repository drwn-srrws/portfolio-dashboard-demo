import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { format, parse } from "date-fns";
import { DateRange } from "react-day-picker";

import {
  DateRangeSinglePicker,
  DateRangeSinglePickerProps,
} from "../DateRangeSinglePicker";
import { FormControl } from "./FormControl";

export type FormDateRangeProps<T extends FieldValues> =
  DateRangeSinglePickerProps &
    UseControllerProps<T> & {
      required?: boolean;
      label?: string;
    };

export const FormDateRange = <T extends FieldValues>(
  props: FormDateRangeProps<T>
) => {
  const { field, fieldState } = useController(props);

  const parsedDateRange = {
    start: field.value?.from ? parseDateString(field.value.from) : undefined,
    end: field.value?.to ? parseDateString(field.value.to) : undefined,
  };

  const customDateRange: DateRange | undefined = {
    from: parsedDateRange.start || undefined,
    to: parsedDateRange.end || undefined,
  };

  return (
    <FormControl
      {...props}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    >
      <DateRangeSinglePicker
        {...props}
        date={customDateRange}
        setDate={(date) => {
          const formattedDate = date
            ? {
                from: date.from ? formatDateToString(date.from) : undefined,
                to: date.to ? formatDateToString(date.to) : undefined,
              }
            : undefined;
          field.onChange(formattedDate);
        }}
      />
    </FormControl>
  );
};

const parseDateString = (dateString: string): Date | undefined => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

const formatDateToString = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

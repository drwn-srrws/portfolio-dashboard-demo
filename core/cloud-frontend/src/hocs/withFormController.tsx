import { ComponentType } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import { FormControlProps } from "@/components/Form/FormControl";

export type WithFormControllerProps<
  T extends FieldValues,
  P extends FormControlProps,
> = P & UseControllerProps<T>;

export function withFormController<P extends FormControlProps>(
  Component: ComponentType<P>
) {
  return <T extends FieldValues>(
    props: Omit<WithFormControllerProps<T, P>, "value" | "onChange">
  ) => {
    const { field, fieldState } = useController(props);

    return (
      <Component
        {...(props as P)}
        {...field}
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    );
  };
}

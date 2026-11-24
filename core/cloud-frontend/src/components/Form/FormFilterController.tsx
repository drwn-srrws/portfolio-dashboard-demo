import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import FilterController, {
  FilterControllerProps,
} from "@/components/FilterController/FilterController";

export type FormFilterControllerProps<T extends FieldValues> = Omit<
  FilterControllerProps,
  "selectedFilters" | "setSelectedFilters"
> &
  UseControllerProps<T>;

export const FormFilterController = <T extends FieldValues>(
  props: FormFilterControllerProps<T>
) => {
  const { field, fieldState } = useController(props);

  return (
    <FilterController
      {...props}
      {...field}
      usePortal={true}
      selectedFilters={field.value}
      setSelectedFilters={field.onChange}
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
};

import { useCallback, useMemo } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { CompanyInstrumentResponse as Instrument } from "@api/types";
import { Selectable } from "@typings/Selectable";
import { SecuritySelect, SecuritySelectProps } from "../SecuritySelect";

export type FormSecuritySelectProps<T extends FieldValues> = Omit<
  SecuritySelectProps & UseControllerProps<T>,
  "value" | "onChange"
>;

export const FormSecuritySelect = <T extends FieldValues>(
  props: FormSecuritySelectProps<T>
) => {
  const { field } = useController(props);

  const value = useMemo(() => {
    return field.value.map((instrument: Instrument) => ({
      value: `${instrument.id}`,
      label: instrument.name,
    }));
  }, [field.value]);

  const handleChange = useCallback(
    (value: Selectable[]) => {
      field.onChange(
        value.map((instrument) => ({
          id: +instrument.value,
          name: instrument.label,
        }))
      );
    },
    [field]
  );

  return (
    <SecuritySelect
      {...props}
      {...field}
      value={value}
      onChange={handleChange}
    />
  );
};

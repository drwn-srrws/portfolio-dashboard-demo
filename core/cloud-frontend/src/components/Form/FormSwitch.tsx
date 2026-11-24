import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import { TextSwitch, TextSwitchProps } from "../TextSwitch";

export type FormSwitchProps<T extends FieldValues> = TextSwitchProps &
  UseControllerProps<T>;

export const FormSwitch = <T extends FieldValues>(
  props: FormSwitchProps<T>
) => {
  const { field } = useController(props);

  return (
    <TextSwitch
      {...props}
      {...field}
      checked={field.value}
      onCheckedChange={() => field.onChange(!field.value)}
    />
  );
};

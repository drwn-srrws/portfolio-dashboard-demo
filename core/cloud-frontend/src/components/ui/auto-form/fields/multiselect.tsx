import { FormControl, FormItem, FormMessage } from "@components/ui/form";
import { CircleX } from "lucide-react";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { CheckboxMultiSelect } from "@/components/CheckboxMultiSelect";

export default function AutoFormMultiselect({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const convertValueToArray = (value: string | string[]) =>
    Array.isArray(value) ? value : [value];
  const value = convertValueToArray(
    field.value || (fieldConfigItem.inputProps?.value as string)
  );

  return (
    <div>
      <FormItem className="flex flex-col">
        <AutoFormLabel label={label} isRequired={isRequired} />
        <FormControl>
          <CheckboxMultiSelect
            options={fieldConfigItem.inputProps?.options || []}
            onChange={field.onChange}
            placeholder={fieldProps.placeholder}
            values={value}
            className={fieldConfigItem.inputProps?.classes}
            testId={(fieldConfigItem.inputProps as { testId?: string })?.testId}
          />
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
      {fieldConfigItem.inputProps?.nullable && (
        <div
          className="absolute top-[1.75rem] right-6 cursor-pointer p-2"
          onClick={() => field.onChange()}
        >
          <CircleX className="opacity-50 size-4" />
        </div>
      )}
    </div>
  );
}

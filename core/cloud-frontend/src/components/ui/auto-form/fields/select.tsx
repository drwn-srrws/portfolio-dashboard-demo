import { CircleX } from "lucide-react";
import { FormControl, FormItem, FormMessage } from "@components/ui/form";
import { TextSelect } from "@/components/TextSelect";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormSelect({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  function findItem(value: any) {
    return values.find((item) => item.value === value);
  }

  const values: { label: string; value: string }[] = fieldProps.options;

  return (
    <div>
      <FormItem>
        <AutoFormLabel label={label} isRequired={isRequired} />
        <FormControl>
          <TextSelect
            virtual
            placeholder={
              field.value ? findItem(field.value)?.label : "Select an option"
            }
            options={values}
            value={field.value}
            onChange={field.onChange}
            {...fieldProps}
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

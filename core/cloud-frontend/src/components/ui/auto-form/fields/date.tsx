import { DatePicker } from "@/components/DatePicker";
import { FormControl, FormItem, FormMessage } from "@components/ui/form";
import { CircleX } from "lucide-react";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormDate({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  return (
    <div className="relative">
      <FormItem>
        <AutoFormLabel label={label} isRequired={isRequired} />
        <FormControl>
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            inputProps={fieldConfigItem.inputProps}
            {...fieldProps}
          />
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />

        <FormMessage />
      </FormItem>
      {fieldConfigItem.inputProps?.nullable && (
        <div
          className="absolute top-[1.75rem] right-6 cursor-pointer p-2 afafsddssdfsdss"
          onClick={() => field.onChange()}
        >
          <CircleX className="opacity-50 size-4" />
        </div>
      )}
    </div>
  );
}

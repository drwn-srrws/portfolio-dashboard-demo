import { FormControl, FormItem, FormMessage } from "@components/ui/form";
import { CircleX } from "lucide-react";
import * as z from "zod";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";
import { TextSelect } from "@/components/TextSelect";

export default function AutoFormEnum({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values;

  let values: [string, string][] = [];
  if (!Array.isArray(baseValues)) {
    values = Object.entries(baseValues);
  } else {
    values = baseValues.map((value) => [value, value]);
  }

  function findItem(value: any) {
    return values.find((item) => item[0] === value);
  }

  return (
    <div className={`relative ${fieldConfigItem.classes || ""}`}>
      <FormItem>
        <AutoFormLabel label={label} isRequired={isRequired} />
        <FormControl className={fieldConfigItem.classes || ""}>
          <TextSelect
            testId={(fieldConfigItem.inputProps as any)?.["data-testid"]}
            virtual
            defaultValue={field.value}
            placeholder={
              field.value ? findItem(field.value)?.[1] : "Select an option"
            }
            options={values.map(([value, label]) => ({
              value,
              label,
            }))}
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
          className="absolute top-[1.75rem] right-8 cursor-pointer p-1.5"
          onClick={() => field.onChange()}
        >
          <CircleX className="opacity-50 size-4" />
        </div>
      )}
    </div>
  );
}

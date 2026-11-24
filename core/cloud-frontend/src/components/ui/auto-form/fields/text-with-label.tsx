import AutoFormLabel from "../common/label";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormTextWithLabel({
  label,
  isRequired,
  field,
  fieldConfigItem,
}: AutoFormInputComponentProps) {
  const value = fieldConfigItem.inputProps?.value || field.value || "";

  return (
    <div className={`flex flex-col ${fieldConfigItem.classes || ""} py-4`}>
      <AutoFormLabel
        label={label}
        isRequired={isRequired}
        className="text-sm font-medium"
      />
      <p
        className={`${fieldConfigItem.inputProps?.classes} min-h-6 mt-2 text-sm pl-3`}
      >
        {value}
      </p>
    </div>
  );
}

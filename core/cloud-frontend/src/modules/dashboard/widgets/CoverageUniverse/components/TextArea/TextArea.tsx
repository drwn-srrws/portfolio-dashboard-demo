import { FormControl, FormControlProps } from "@components/Form/FormControl";
import {
  Textarea as BaseTextArea,
  TextareaProps as BaseTextAreaProps,
} from "@components/ui";

export interface TextAreaProps
  extends Omit<BaseTextAreaProps, "value">,
    FormControlProps {
  showCounter?: boolean;
  value?: string;
  maxLength?: number;
}

export const TextArea = ({
  showCounter,
  value,
  maxLength,
  error,
  helperText,
  label,
  required,
  ...props
}: TextAreaProps) => (
  <FormControl
    error={error}
    helperText={helperText}
    label={label}
    required={required}
  >
    <BaseTextArea
      {...props}
      value={value}
      maxLength={maxLength}
      placeholder="Description about the rating change"
      className="h-full"
    />
    {showCounter && (
      <div className="absolute bottom-2 right-2 text-xs text-neutral-400">
        {value?.length}/{maxLength}
      </div>
    )}
  </FormControl>
);

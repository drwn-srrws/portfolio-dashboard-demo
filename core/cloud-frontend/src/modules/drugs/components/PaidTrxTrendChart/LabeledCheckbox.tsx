import { Checkbox } from "@components/ui";

interface LabeledCheckboxProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  testId?: string;
}

export const LabeledCheckbox = ({
  label,
  checked,
  disabled,
  onChange,
  testId,
}: LabeledCheckboxProps) => (
  <label
    className={`flex items-center gap-2 text-sm ${
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    }`}
  >
    <Checkbox
      checked={checked}
      disabled={disabled}
      onCheckedChange={(state) => onChange(state === true)}
      data-testid={testId}
    />
    {label}
  </label>
);

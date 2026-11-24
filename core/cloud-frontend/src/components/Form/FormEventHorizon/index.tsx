import {
  Control,
  FieldValues,
  Path,
  useController,
  useWatch,
} from "react-hook-form";

import { FormControl } from "@components/Form/FormControl";
import { FormDatePicker } from "@components/Form/FormDatePicker";
import { FormTextSelect } from "@components/Form/FormTextSelect";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";
import {
  EventDateShape,
  getMonthLabel,
  getQuarterLabel,
} from "@/utils/eventHorizon";

const SHAPE_OPTIONS: { value: EventDateShape; label: string }[] = [
  { value: "date", label: "Specific date" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
];

const RANGE_OPTIONS = [
  { value: 0, label: "No range (just this date)" },
  ...[1, 2, 3, 4].map((weeks) => ({
    value: weeks,
    label: `± ${weeks} week${weeks > 1 ? "s" : ""}`,
  })),
];

export interface FormEventHorizonProps<T extends FieldValues> {
  control: Control<T>;
  shapeName: Path<T>;
  dateName: Path<T>;
  rangeWeeksName: Path<T>;
  required?: boolean;
}

export const FormEventHorizon = <T extends FieldValues>({
  control,
  shapeName,
  dateName,
  rangeWeeksName,
  required,
}: FormEventHorizonProps<T>) => {
  const { field: shapeField } = useController({ control, name: shapeName });
  const { field: rangeWeeksField } = useController({
    control,
    name: rangeWeeksName,
  });
  const shape = shapeField.value as EventDateShape;

  const anchorDate = useWatch({ control, name: dateName }) as Date | undefined;

  const handleShapeChange = (value: string) => {
    if (!value) return;
    shapeField.onChange(value);
    if (value === "date" && rangeWeeksField.value === undefined) {
      rangeWeeksField.onChange(0);
    }
  };

  const dateLabel =
    shape === "date"
      ? "Date"
      : shape === "month"
        ? "Any date in target month"
        : "Any date in target quarter";

  const periodPreview =
    anchorDate instanceof Date && !isNaN(anchorDate.getTime())
      ? shape === "month"
        ? `Target month: ${getMonthLabel(anchorDate)}`
        : shape === "quarter"
          ? `Target quarter: ${getQuarterLabel(anchorDate)}`
          : undefined
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <FormControl label="Date type" required={required}>
        <ToggleGroup
          type="single"
          value={shape}
          onValueChange={handleShapeChange}
          className="justify-start flex-wrap gap-2"
          variant="outline"
        >
          {SHAPE_OPTIONS.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              data-testid={`event-date-shape-${option.value}`}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FormControl>

      <FormDatePicker
        required={required}
        name={dateName}
        control={control}
        label={dateLabel}
        placeholder="Select date"
        tip={periodPreview}
        testId="event-date-picker"
      />

      {shape === "date" && (
        <FormTextSelect
          required={required}
          name={rangeWeeksName}
          control={control}
          label="Range"
          placeholder="Select range"
          options={RANGE_OPTIONS}
          testId="event-range-select"
        />
      )}
    </div>
  );
};

import { useCallback, useMemo } from "react";
import { LegendSelect, LegendSelectProps } from "./LegendSelect";

export interface LegendProps
  extends Omit<LegendSelectProps, "values" | "onChange"> {
  disabledValues: string[];
  onDisabledValuesChange: (values: string[]) => void;
}

export const Legend = ({
  options,
  disabledValues,
  onDisabledValuesChange,
  ...props
}: LegendProps) => {
  const legendValues = useMemo(
    () => options.map((option) => option.value),
    [options]
  );

  const selectedLegendValues = useMemo(() => {
    return legendValues.filter((value) => !disabledValues.includes(value));
  }, [disabledValues, legendValues]);

  const handleLegendChange = useCallback(
    (values: string[]) => {
      const disabledValues = legendValues.filter(
        (legendValue) => !values.includes(legendValue)
      );

      onDisabledValuesChange(disabledValues);
    },
    [legendValues, onDisabledValuesChange]
  );

  return (
    <LegendSelect
      {...props}
      values={selectedLegendValues}
      options={options}
      onChange={handleLegendChange}
    />
  );
};

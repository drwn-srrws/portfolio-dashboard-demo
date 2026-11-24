import { Tooltip } from "@/components/Tooltip/Tooltip";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { MetricDisplayType } from "@/api/types";
import { ivolAsOfSuffix } from "@/utils/ivol";

export interface IvolSubValueProps {
  value: number | null | undefined;
  asOfDt?: string | null;
  tooltipLabel: string;
  formattedValue?: string;
}

export const IvolSubValue = ({
  value,
  asOfDt,
  tooltipLabel,
  formattedValue,
}: IvolSubValueProps) => {
  const hasValue = value !== null && value !== undefined;
  const status = hasValue
    ? getValueStatusForMetric({
        value,
        metric: { display_type: MetricDisplayType.percent },
      })
    : undefined;
  const displayValue = hasValue
    ? (formattedValue ??
      formatMetric(value as number, MetricDisplayType.percent))
    : "-";

  return (
    <Tooltip
      trigger={
        <span className="grid grid-cols-[28px_1fr] items-center gap-x-1 text-[10px] leading-none">
          <span className="text-right uppercase text-neutral-500">IVOL</span>
          <span
            className="text-left"
            style={hasValue ? { color: cellColor[status!] } : undefined}
          >
            {displayValue}
          </span>
        </span>
      }
      content={
        hasValue
          ? `${tooltipLabel}: ${displayValue}${ivolAsOfSuffix(asOfDt)}`
          : `${tooltipLabel}: no iVol data available${ivolAsOfSuffix(asOfDt)}`
      }
      contentClasses="bg-neutral-800 text-white rounded max-w-[20rem] break-words border border-neutral-600 shadow-md p-2"
    />
  );
};

import { isUnixTimestamp } from "@/utils";
import { formatMetric } from "@/utils/metrics";
import {
  TooltipContainer,
  TooltipTitle,
  useCrosshairContext,
} from "@components/Chart";
import { format, fromUnixTime } from "date-fns";
import { Time } from "lightweight-charts";
import { IMetricChartSeries } from "./MetricChart";

export interface MetricChartTooltipProps {
  series: IMetricChartSeries;
}

function formatDate(input: Time): string {
  if (isUnixTimestamp(Number(input))) {
    const date = fromUnixTime(Number(input));
    return format(date, "MMMM d, yyyy HH:mm");
  } else {
    return input as string;
  }
}

export const MetricChartTooltip = ({ series }: MetricChartTooltipProps) => {
  const { closestPoint } = useCrosshairContext();
  return (
    <TooltipContainer>
      <TooltipTitle style={{ color: series.color }}>{series.name}</TooltipTitle>

      <span className="text-xs">
        <b>Time:</b> {closestPoint?.time ? formatDate(closestPoint.time) : "-"}
      </span>

      <span className="text-xs">
        <b>Value:</b>{" "}
        {formatMetric(closestPoint?.value, series.metricDisplayType)}
      </span>
    </TooltipContainer>
  );
};

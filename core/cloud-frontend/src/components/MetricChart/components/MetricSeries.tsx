import { memo, useMemo } from "react";
import { DeepPartial, PriceFormatCustom } from "lightweight-charts";
import { formatMetric } from "@utils/metrics";
import { LineSeries } from "@components/Chart";
import { IMetricChartSeries } from "./MetricChart";

export interface MetricSeriesProps {
  data: IMetricChartSeries;
}

export const MetricSeries = memo(({ data }: MetricSeriesProps) => {
  const metricDisplayType = data.metricDisplayType;

  const priceFormat = useMemo(() => {
    const priceFormat: DeepPartial<PriceFormatCustom> = {
      type: "custom",
      formatter: (value: string) => formatMetric(value, metricDisplayType),
    };

    return priceFormat;
  }, [metricDisplayType]);

  return (
    <LineSeries
      data={data.data}
      color={data.color}
      lineWidth={1}
      lastValueVisible={false}
      priceLineVisible={false}
      priceFormat={priceFormat}
    />
  );
});

import { useMemo } from "react";
import { formatAndProcessTreemapData } from "@/utils/treemap";
import { MetricCatalogItem } from "@api/types/index";
import { HeatMapConfig } from "./useHeatMapConfig";

interface UseFormattedHeatMapDataParams {
  data: Array<Record<string, unknown>>;
  effectiveGroupBy: string;
  config: HeatMapConfig;
  metricsCatalog: MetricCatalogItem[];
}

export const useFormattedHeatMapData = ({
  data,
  effectiveGroupBy,
  config,
  metricsCatalog,
}: UseFormattedHeatMapDataParams) => {
  const metrics = useMemo(
    () =>
      metricsCatalog.filter(
        (metric) =>
          metric.name === config.colorMetric ||
          metric.name === config.sizeMetric
      ),
    [metricsCatalog, config.colorMetric, config.sizeMetric]
  );

  const formattedData = useMemo(() => {
    if (!data.length || !effectiveGroupBy || !config.requiredDimensions[0]) {
      return [];
    }

    return formatAndProcessTreemapData({
      data,
      groupByMetric: effectiveGroupBy,
      colorMetric: config.colorMetric,
      sizeMetric: config.sizeMetric,
      leafMetric: config.requiredDimensions[0],
      metrics,
    });
  }, [
    data,
    effectiveGroupBy,
    config.colorMetric,
    config.sizeMetric,
    config.requiredDimensions,
    metrics,
  ]);

  return formattedData;
};

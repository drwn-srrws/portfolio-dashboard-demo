import { MetricDisplayType, MetricCatalogItem } from "@api/types/index";
import { ITooltipParams } from "@ag-grid-community/core";
import { getMetricData } from "@/modules/dashboard/widgets/CoverageUniverse/helpers/getMetricData";

export const createFullPrecisionPercentTooltipProps = (metric?: {
  display_type?: MetricDisplayType;
}) => {
  if (!metric || metric.display_type !== MetricDisplayType.percent) {
    return {};
  }

  return {
    tooltipValueGetter: (params: { value?: unknown }): string => {
      if (params.value === null || params.value === undefined) {
        return "No data";
      }

      if (typeof params.value !== "number") {
        return String(params.value);
      }

      const rawValue = params.value;
      const fullPrecisionPercent = (rawValue * 100).toString();

      return `${fullPrecisionPercent}%`;
    },
  };
};

export const createMetricPercentPrecisionTooltip = (
  catalogFields: MetricCatalogItem[],
  metricKey: string
) => {
  const metric = getMetricData(catalogFields, metricKey);
  const tooltipProps = createFullPrecisionPercentTooltipProps(metric);

  return {
    tooltipValueGetter: (params: ITooltipParams) => {
      const rawValue = params.data?.[metricKey];
      const extractedParams = { ...params, value: rawValue };
      return tooltipProps.tooltipValueGetter?.(extractedParams) || "";
    },
  };
};

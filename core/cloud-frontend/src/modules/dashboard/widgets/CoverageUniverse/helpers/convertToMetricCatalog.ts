import { CompanyCatalogItem } from "@/api/types";
import { MetricCatalogItem, MetricDisplayType } from "@/api/types";

export const convertToMetricCatalog = (
  fields: CompanyCatalogItem[]
): MetricCatalogItem[] => {
  const displayTypeMap: Record<string, MetricDisplayType> = {
    string: MetricDisplayType.string,
    percent: MetricDisplayType.percent,
    pnl: MetricDisplayType.pnl,
    dollars: MetricDisplayType.dollars,
    integer: MetricDisplayType.integer,
    float: MetricDisplayType.float,
    date: MetricDisplayType.date,
    ratio: MetricDisplayType.ratio,
    percent_no_decimals: MetricDisplayType.percent_no_decimals,
    currency: "currency" as MetricDisplayType,
    number: MetricDisplayType.float,
  };

  return fields.map((field) => ({
    ...field,
    display_type:
      displayTypeMap[field.display_type] || MetricDisplayType.string,
  }));
};

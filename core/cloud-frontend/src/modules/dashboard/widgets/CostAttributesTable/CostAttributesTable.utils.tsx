import { ColDef } from "@ag-grid-community/core";
import { formatMetric } from "@/utils/metrics";
import { MetricDisplayType, MetricCatalogItem } from "@api/types";
import { getMetricData } from "@/modules/dashboard/widgets/CoverageUniverse/helpers/getMetricData";

export const createCostAttributesColDefs = (
  metricsCatalog: MetricCatalogItem[]
): ColDef[] => [
  {
    field: "instrument_name",
    headerName: "Instrument Name",
    flex: 2,
  },
  {
    field: "average_cost",
    headerName: "Average Cost",
    flex: 1,
    cellDataType: "number",
    valueFormatter: (params) => {
      if (!params.value) return "N/A";

      return formatMetric(params.value, "dollars_regular");
    },
  },
  {
    field: "native_average_cost",
    headerName: "Native Average Cost",
    flex: 1,
    cellDataType: "number",
    valueFormatter: (params) => {
      if (!params.value) return "N/A";
      const displayType = getMetricData(metricsCatalog, "native_average_cost")
        ?.display_type as MetricDisplayType;

      return formatMetric(params.value, displayType);
    },
  },
];

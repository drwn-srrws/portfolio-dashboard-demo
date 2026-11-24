import { useMemo } from "react";
import {
  MetricCatalogItem,
  BenchmarkAndFundPerformanceStats,
} from "@api/types/index";
import { ColDef } from "@ag-grid-community/core";

export interface FundPerformanceRow extends Record<string, unknown> {
  name: string;
  isLastFund?: boolean;
}

interface UseFormattedFundPerformanceDataParams {
  data: Array<BenchmarkAndFundPerformanceStats>;
  displayColumns: string[];
  metricsCatalog: MetricCatalogItem[];
  transformToRowsData: (
    data: Array<BenchmarkAndFundPerformanceStats>
  ) => FundPerformanceRow[];
  createColumnsFunction: (
    catalog: MetricCatalogItem[],
    displayColumns: string[]
  ) => ColDef<FundPerformanceRow>[];
}

export const useFormattedFundPerformanceData = ({
  data,
  displayColumns,
  metricsCatalog,
  transformToRowsData,
  createColumnsFunction,
}: UseFormattedFundPerformanceDataParams) => {
  const rows = useMemo(() => {
    if (!data.length) {
      return [];
    }
    return transformToRowsData(data);
  }, [data, transformToRowsData]);

  const columns = useMemo(() => {
    if (!metricsCatalog.length || !displayColumns.length) {
      return [];
    }
    return createColumnsFunction(metricsCatalog, displayColumns);
  }, [metricsCatalog, displayColumns, createColumnsFunction]);

  return {
    rows,
    columns,
  };
};

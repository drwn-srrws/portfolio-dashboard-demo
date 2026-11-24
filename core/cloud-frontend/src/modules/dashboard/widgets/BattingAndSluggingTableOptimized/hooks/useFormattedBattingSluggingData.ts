import { useMemo } from "react";
import { MetricCatalogItem } from "@api/types/index";
import { ColDef } from "@ag-grid-community/core";
import { AnalystStats } from "@/api/types";
import { BattingSluggingResponse } from "@api/types/index";

interface UseFormattedBattingSluggingDataParams {
  responses: BattingSluggingResponse[];
  totalData?: AnalystStats;
  metricsCatalog: MetricCatalogItem[];
  buildNestedRows: (
    responses: BattingSluggingResponse[]
  ) => Array<Record<string, unknown>>;
  createTotalRow: (
    totalData: AnalystStats | undefined
  ) => Array<Record<string, unknown>>;
  getDisplayColumnsFromResponse: (
    responses: BattingSluggingResponse[]
  ) => string[];
  getGroupingFieldsFromResponse: (
    responses: BattingSluggingResponse[]
  ) => string[];
  createColumnsFunction: (
    displayColumns: string[],
    groupByFields: string[],
    metricsCatalog: MetricCatalogItem[]
  ) => ColDef[];
  createAutoGroupColumnDef: (
    groupByFields: string[],
    metricsCatalog: MetricCatalogItem[]
  ) => ColDef;
}

export const useFormattedBattingSluggingData = ({
  responses,
  totalData,
  metricsCatalog,
  buildNestedRows,
  createTotalRow,
  getDisplayColumnsFromResponse,
  getGroupingFieldsFromResponse,
  createColumnsFunction,
  createAutoGroupColumnDef,
}: UseFormattedBattingSluggingDataParams) => {
  const formattedData = useMemo(
    () => buildNestedRows(responses),
    [responses, buildNestedRows]
  );

  const groupByFields = useMemo(
    () => getGroupingFieldsFromResponse(responses),
    [responses, getGroupingFieldsFromResponse]
  );

  const displayColumns = useMemo(
    () => getDisplayColumnsFromResponse(responses),
    [responses, getDisplayColumnsFromResponse]
  );

  const totalRowData = useMemo(
    () => createTotalRow(totalData),
    [totalData, createTotalRow]
  );

  const columns = useMemo(
    () => createColumnsFunction(displayColumns, groupByFields, metricsCatalog),
    [displayColumns, groupByFields, metricsCatalog, createColumnsFunction]
  );

  const autoGroupColumnDef = useMemo(
    () => createAutoGroupColumnDef(groupByFields, metricsCatalog),
    [groupByFields, metricsCatalog, createAutoGroupColumnDef]
  );

  return {
    formattedData,
    totalRowData,
    columns,
    autoGroupColumnDef,
    groupByFields,
  };
};

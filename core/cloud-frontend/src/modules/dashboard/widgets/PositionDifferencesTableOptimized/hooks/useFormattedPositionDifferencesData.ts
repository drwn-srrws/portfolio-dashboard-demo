import { useMemo } from "react";
import {
  MetricCatalogItem,
  PositionDifferencesResponseMetadata,
} from "@api/types/index";
import { ColDef } from "@ag-grid-community/core";

interface UseFormattedPositionDifferencesDataParams {
  data: Array<Record<string, unknown>>;
  metadata?: PositionDifferencesResponseMetadata;
  metricsCatalog: MetricCatalogItem[];
  transformToRowsData: (
    data: Array<Record<string, unknown>>
  ) => Array<{ id: string } & Record<string, unknown>>;
  createColumnsFunction: (
    catalog: MetricCatalogItem[],
    data: Array<Record<string, unknown>>,
    metadata?: PositionDifferencesResponseMetadata
  ) => ColDef[];
}

export const useFormattedPositionDifferencesData = ({
  data,
  metadata,
  metricsCatalog,
  transformToRowsData,
  createColumnsFunction,
}: UseFormattedPositionDifferencesDataParams) => {
  const rows = useMemo(() => {
    if (!data.length) {
      return [];
    }

    return transformToRowsData(data);
  }, [data, transformToRowsData]);

  const columns = useMemo(() => {
    if (!data.length) {
      return [];
    }

    return createColumnsFunction(metricsCatalog, data, metadata);
  }, [data, metricsCatalog, metadata, createColumnsFunction]);

  return {
    rows,
    columns,
  };
};

import { ColDef } from "@ag-grid-community/core";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { useCompanyPageData } from "@/hooks/api/useCompanyPageData";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { useGetPortfolioMetricCatalogV3 } from "@/hooks/api/useGetPortfolioMetricCatalog";

import Card from "../Card/Card";
import { createCostAttributesColDefs } from "./CostAttributesTable.utils";

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 150,
};

const CostAttributesTableContent = () => {
  const params = useParams();
  const { companyId } = params;
  const { data: metricsCatalogData, isLoading: isLoadingCatalog } =
    useGetPortfolioMetricCatalogV3({
      include_filterable_values: false,
    });

  const metricsCatalog = useMemo(
    () => metricsCatalogData?.metrics || [],
    [metricsCatalogData]
  );

  const { companyData, isLoading } = useCompanyPageData(Number(companyId));
  const costAttributesColumns = useMemo(
    () => createCostAttributesColDefs(metricsCatalog),
    [metricsCatalog]
  );

  const costAttributesData = useMemo(() => {
    if (!companyData?.average_costs) return [];

    return companyData.average_costs
      .filter((cost) => cost.instrument_name)
      .map((cost) => ({
        instrument_name: cost.instrument_name,
        average_cost: cost.average_cost,
        native_average_cost: cost.native_average_cost,
      }));
  }, [companyData]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: "responsive",
    }),
    []
  );

  const isLoadingData = isLoading || isLoadingCatalog;

  return (
    <Card title="Cost Attributes" className="flex-[2]">
      {costAttributesData.length || isLoadingData ? (
        <DataGrid
          layout={dataGridLayout}
          rowData={costAttributesData}
          columnDefs={costAttributesColumns}
          loading={isLoadingData}
          defaultColDef={defaultColDef}
          getRowId={(row) => row.instrument_name}
        />
      ) : (
        <NoDataOverlay />
      )}
    </Card>
  );
};

export const CostAttributesTable = withAppInsights(
  CostAttributesTableContent,
  "CostAttributesTable"
);

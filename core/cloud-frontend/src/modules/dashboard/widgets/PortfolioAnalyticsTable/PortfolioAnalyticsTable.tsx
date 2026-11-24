import { ColDef } from "@ag-grid-community/core";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { useGetCompanyPagePortfolioAnalytics } from "@api/endpoints/company/company";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";

import Card from "../Card/Card";
import { portfolioAnalyticsColDefs } from "./PortfolioAnalyticsTable.utils";

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 150,
};

const PortfolioAnalyticsTableContent = () => {
  const params = useParams();
  const { companyId } = params;

  const { data: portfolioAnalytics, isLoading } =
    useGetCompanyPagePortfolioAnalytics(Number(companyId));

  const portfolioAnalyticsColumns = useMemo(
    () => portfolioAnalyticsColDefs,
    []
  );

  const portfolioAnalyticsBody = useMemo(() => {
    const maxLength = Math.max(
      portfolioAnalytics?.size?.length || 0,
      portfolioAnalytics?.mtd_pnl?.length || 0,
      portfolioAnalytics?.qtd_pnl?.length || 0,
      portfolioAnalytics?.ytd_pnl?.length || 0
    );

    const portfolioAnalyticsBody = Array.from({ length: maxLength }).map(
      (_, i) => ({
        fund: portfolioAnalytics?.size?.[i]?.fund?.display_name,
        size: portfolioAnalytics?.size?.[i]?.size,
        mtd: portfolioAnalytics?.mtd_pnl?.[i]?.pnl,
        qtd: portfolioAnalytics?.qtd_pnl?.[i]?.pnl,
        ytd: portfolioAnalytics?.ytd_pnl?.[i]?.pnl,
      })
    );

    return portfolioAnalyticsBody;
  }, [portfolioAnalytics]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: "responsive",
    }),
    []
  );

  return (
    <Card title="Portfolio Analytics" className="flex-[2]">
      {portfolioAnalyticsBody.length || isLoading ? (
        <DataGrid
          layout={dataGridLayout}
          rowData={portfolioAnalyticsBody}
          columnDefs={portfolioAnalyticsColumns}
          loading={isLoading}
          defaultColDef={defaultColDef}
          getRowId={(row) => row.fund}
        />
      ) : (
        <NoDataOverlay />
      )}
    </Card>
  );
};

export const PortfolioAnalyticsTable = withAppInsights(
  PortfolioAnalyticsTableContent,
  "PortfolioAnalyticsTable"
);

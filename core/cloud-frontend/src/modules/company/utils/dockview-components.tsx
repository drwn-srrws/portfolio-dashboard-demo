import React from "react";

import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import OverviewCard from "@/modules/dashboard/widgets/Card/OverviewCard";
import { EventsTable } from "@/modules/dashboard/widgets/EventsTable/EventsTable";
import { PortfolioAnalyticsTable } from "@/modules/dashboard/widgets/PortfolioAnalyticsTable/PortfolioAnalyticsTable";
import { CostAttributesTable } from "@/modules/dashboard/widgets/CostAttributesTable/CostAttributesTable";
import { RealTimeTickerPriceChart } from "@/modules/dashboard/widgets/RealTimeTickerPriceChart";
import { CompanyDrugPrograms } from "@/modules/dashboard/widgets/CompanyDrugPrograms";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { PanelProvider } from "@/providers/PanelProvider";
import { IDockviewPanelProps } from "dockview-react";
import { useConfig } from "@/providers/ConfigProvider";

export const components = {
  OverviewCard: React.memo(() => <OverviewCard />),
  PortfolioAnalyticsTable: React.memo(() => <PortfolioAnalyticsTable />),
  CostAttributesTable: React.memo(() => <CostAttributesTable />),
  TrendsChart: React.memo((props: IDockviewPanelProps) => {
    const config = useConfig();

    const defaultFilters = config.pages?.coverageMonitor?.hiddenFilters;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <RealTimeTickerPriceChart
              defaultFilters={defaultFilters ? [defaultFilters] : []}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }),
  EventsTable: React.memo(() => <EventsTable />),
  CompanyDrugPrograms: React.memo(() => <CompanyDrugPrograms />),
};

import { IDockviewPanelProps } from "dockview-react";
import React from "react";

import { PnlBySubteamTable as PnlBySubteamOptimizedWidget } from "@/modules/dashboard/widgets/PnlBySubteamOptimized";
import { PnlByNewCompaniesCompanyViewTable as PnlByNewCompaniesCompanyViewOptimizedWidget } from "@/modules/dashboard/widgets/PnlByNewCompaniesCompanyViewOptimized";
import { PnlByNewCompaniesAnalystViewTable as PnlByNewCompaniesAnalystViewOptimizedWidget } from "@/modules/dashboard/widgets/PnlByNewCompaniesAnalystViewOptimized";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";

export const PnlBySubteam = React.memo((props: IDockviewPanelProps) => {
  const defaultBenchmarkId = props.params.defaultBenchmarkId;

  return (
    <PanelProvider value={props}>
      <WidgetErrorBoundary>
        <QueryLocalFiltersProvider>
          <PnlBySubteamOptimizedWidget
            defaultBenchmarkId={defaultBenchmarkId}
          />
        </QueryLocalFiltersProvider>
      </WidgetErrorBoundary>
    </PanelProvider>
  );
});

export const PnlByNewCompaniesCompanyView = React.memo(
  (props: IDockviewPanelProps) => {
    const defaultFundName = props.params.defaultFundName;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PnlByNewCompaniesCompanyViewOptimizedWidget
              defaultFundName={defaultFundName}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

export const PnlByNewCompaniesAnalystView = React.memo(
  (props: IDockviewPanelProps) => {
    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PnlByNewCompaniesAnalystViewOptimizedWidget />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

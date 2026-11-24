import { IDockviewPanelProps } from "dockview-react";
import React from "react";
import { QueryLocalFiltersProvider } from "@/providers/LocalFiltersProvider";
import { PerformanceDistribution as PerformanceDistributionWidget } from "@/modules/dashboard/widgets/PerformanceDistribution";
import { WidgetErrorBoundary } from "@/components/Widget/WidgetErrorBoundary";
import { PanelProvider } from "@/providers/PanelProvider";

export const PerformanceDistribution = React.memo(
  (props: IDockviewPanelProps) => {
    const groupByMetrics = props.params.groupByMetrics;

    const defaultGroupByMetric = props.params.defaultGroupByMetric;
    const defaultDisplayMetric = props.params.defaultDisplayMetric;

    const defaultSubgroupBy = props.params.defaultSubgroupBy;
    const defaultSizeMetric = props.params.defaultSizeMetric;

    return (
      <PanelProvider value={props}>
        <WidgetErrorBoundary>
          <QueryLocalFiltersProvider>
            <PerformanceDistributionWidget
              groupByMetrics={groupByMetrics}
              defaultGroupByMetric={defaultGroupByMetric}
              defaultDisplayMetric={defaultDisplayMetric}
              defaultSubgroupBy={defaultSubgroupBy}
              defaultSizeMetric={defaultSizeMetric}
            />
          </QueryLocalFiltersProvider>
        </WidgetErrorBoundary>
      </PanelProvider>
    );
  }
);

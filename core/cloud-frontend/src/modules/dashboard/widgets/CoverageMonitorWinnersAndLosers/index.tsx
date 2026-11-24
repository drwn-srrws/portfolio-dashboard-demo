import { useMemo, useRef } from "react";

import { CompanyCatalogRequestFilters } from "@/api/types";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { TextSelect } from "@components/TextSelect";
import { SkeletonWrapper } from "@components/SkeletonWrapper/SkeletonWrapper";
import { useSelection } from "@hooks/useSelection";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { mapFiltersToCompanyFilters } from "../CoverageUniverse/helpers/filters";
import { WinnersAndLosersTable } from "./components/WinnersAndLosersTable";
import { useWinnersAndLosers } from "./hooks/useWinnersAndLosers";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { useDateRange } from "@/providers/DateRangeProvider";
import { GridApi } from "@ag-grid-community/core";
import { exportMultipleDatagridsToCSV } from "@/components/Datagrid/helpers/exportToCSV";
export interface WinnersAndLosersSelection {
  top: string;
}

export interface WinnersAndLosersTableProps {
  groupByTop: string[];
  sortByMetric: string;
  filter: CompanyCatalogRequestFilters;
}

const CoverageMonitorWinnersAndLosersContent = ({
  groupByTop,
  sortByMetric,
  filter,
}: WinnersAndLosersTableProps) => {
  const gridRefWinners = useRef<GridApi | null>(null);
  const gridRefLosers = useRef<GridApi | null>(null);
  const { filters: sharedFilters } = useSharedFilters();

  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate, endDate } = useDateRange();

  const { selection, handleSelectionChange } =
    useSelection<WinnersAndLosersSelection>({
      top: groupByTop[1],
    });

  const { winnersRows, losersRows, isLoadingWinners, isLoadingLosers } =
    useWinnersAndLosers({
      selection,
      startDate: panelStartDate ?? startDate,
      endDate: panelEndDate ?? endDate,
      sortByMetric,
      filter: {
        op: "and",
        filters: [
          ...(sharedFilters ? mapFiltersToCompanyFilters(sharedFilters) : []),
          ...(filter ? [filter] : []),
        ],
      },
    });

  const topOptions = useMemo(
    () =>
      groupByTop.map((option) => ({
        label: `Top ${option}`,
        value: option,
      })),
    [groupByTop]
  );
  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle
          exportToCSV={(name) => {
            exportMultipleDatagridsToCSV(
              gridRefWinners,
              gridRefLosers,
              name,
              "Winners",
              "Losers"
            );
          }}
        >
          Top Winners & Losers
        </WidgetTitle>
        <WidgetActions>
          <SkeletonWrapper
            isLoading={isLoadingWinners || isLoadingLosers}
            skeletonClassName="w-[128px] h-9"
          >
            <TextSelect
              disablePortal
              virtual
              options={topOptions}
              value={selection.top}
              placeholder="Select Top"
              onChange={handleSelectionChange("top")}
              testId="winners-losers-top-select"
            />
          </SkeletonWrapper>

          <WidgetMaximizeButton id="winners-and-losers-maximize-button" />
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody data-testid="winners-losers-table-body">
        <WinnersAndLosersTable
          gridRefWinners={gridRefWinners}
          gridRefLosers={gridRefLosers}
          isLoadingWinners={isLoadingWinners}
          isLoadingLosers={isLoadingLosers}
          winnersRows={winnersRows || []}
          losersRows={losersRows || []}
          sortByMetric={sortByMetric}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const CoverageMonitorWinnersAndLosers = withAppInsights(
  CoverageMonitorWinnersAndLosersContent,
  "CoverageMonitorWinnersAndLosers"
);

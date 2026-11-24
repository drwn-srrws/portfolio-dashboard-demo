import { IDockviewPanelProps } from "dockview-react";
import { useCallback, useMemo, useState } from "react";

import { NoDataOverlay } from "@/components/Overlay/NoDataOverlay";
import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { usePanel } from "@/providers/PanelProvider";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { data } from "./data";
import {
  createMetricChartSeries,
  mapV2MetricResultToChartData,
} from "@/utils/charts";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { Selectable } from "@/typings/Selectable";
import {
  exportTimeSeriesToCSV,
  TimeSeries,
} from "@/components/MultiChart/utils";
import { MetricChart } from "@/components/MetricChart";
import { cn } from "@/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

interface Props {
  dockViewPanelProps?: IDockviewPanelProps;
}

const PerformanceSummaryContent = ({ dockViewPanelProps }: Props) => {
  const [selectedInstrumentName, setSelectedInstrumentName] = useState<
    Selectable["value"][]
  >([]);
  const panelProps = usePanel();
  const { isMaximized } = usePanelMaximize();

  const props = dockViewPanelProps || panelProps;

  const filteredData = selectedInstrumentName.length
    ? data.filter((item) =>
        selectedInstrumentName.includes(item.instrument_name)
      )
    : data;

  const formattedData = useMemo(() => {
    const metricChartData = mapV2MetricResultToChartData(
      "instrument_name",
      "price",
      filteredData
    );

    return createMetricChartSeries(metricChartData, "dollars_regular");
  }, [filteredData]);

  const instrumentNames = new Set(data.map((item) => item.instrument_name));

  const exportToCSV = useCallback(
    (name: string) => {
      exportTimeSeriesToCSV(name, formattedData as TimeSeries[]);
    },
    [formattedData]
  );

  return (
    <WidgetWrapper>
      <WidgetHeader className="justify-start gap-6">
        <WidgetTitle {...{ exportToCSV }}>
          {props?.params?.titleSettings || "Performance Summary"}
        </WidgetTitle>
        <WidgetActions className="w-full justify-between">
          <BadgeMultiSelect
            disablePortal
            value={selectedInstrumentName}
            options={Array.from(instrumentNames).map((label) => ({
              label,
              value: label,
            }))}
            alwaysShowPlaceholder
            placeholder="Instrument Name"
            onChange={(value) => setSelectedInstrumentName(value)}
            hasRemoveAction
            onRemoveActionClick={() => setSelectedInstrumentName([])}
          />
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody>
        <div className={cn("h-96 md:h-full", isMaximized && "h-full")}>
          {!formattedData.length ? (
            <NoDataOverlay />
          ) : (
            <MetricChart disableTooltip data={formattedData} />
          )}
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const PerformanceSummary = withAppInsights(
  PerformanceSummaryContent,
  "PerformanceSummary"
);

import { useCallback, useMemo, useState } from "react";

import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { Skeleton } from "@components/ui/skeleton";

import { WidgetActions } from "@components/Widget/WidgetActions";
import { WidgetBody } from "@components/Widget/WidgetBody";
import { WidgetHeader } from "@components/Widget/WidgetHeader";
import WidgetMaximizeButton from "@components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "@components/Widget/WidgetTitle";
import { WidgetWrapper } from "@components/Widget/WidgetWrapper";

import { CompanyLogicalFilterFiltersItem } from "@/api/types";
import { mapToTreemapData } from "../../helpers/mapToTreemapData";
import { mapGroupStatsToTreemapData } from "../../helpers/mapGroupStatsToTreemapData";
import { useGetCoverageDistribution } from "../../hooks/useGetCoverageDistribution";
import { CoverageTreemap } from "../CoverageTreemap";
import { mapFiltersToCompanyFilters } from "../../../CoverageUniverse/helpers/filters";
import { useSharedFilters } from "@/hooks/useSharedFilters";
import { cn } from "@/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { TextSelect } from "@/components/TextSelect";
import { BoxType, SizeMetric } from "../../types";
import {
  groupSizeOptions,
  companySizeOptions,
  metricOptions,
} from "../../constants/groupByOptions";

export interface CoverageDistributionProps {
  defaultMetric?: string;
  defaultAdvancedFilter?: CompanyLogicalFilterFiltersItem[];
  defaultBoxType?: BoxType;
  defaultSizeMetric?: SizeMetric;
}

export const CoverageDistributionContent = ({
  defaultMetric: metric = "market_cap_bbg",
  defaultAdvancedFilter,
  defaultBoxType = "company",
  defaultSizeMetric = "market_cap",
}: CoverageDistributionProps) => {
  const [boxType, setBoxType] = useState<BoxType>(defaultBoxType);
  const [sizeMetric, setSizeMetric] = useState<SizeMetric>(defaultSizeMetric);

  const { isMaximized } = usePanelMaximize();
  const { filters: sharedFilters } = useSharedFilters();

  const { data, isLoading: isLoadingCoverageDistribution } =
    useGetCoverageDistribution({
      metric,
      filter: {
        op: "and",
        filters: [
          ...(sharedFilters
            ? mapFiltersToCompanyFilters(sharedFilters).filter(Boolean)
            : []),
          ...(defaultAdvancedFilter ? defaultAdvancedFilter : []),
        ],
      },
    });

  const treemapData = useMemo(() => {
    if (!data) return [];

    if (boxType === "company") {
      return data.items.map((company) => mapToTreemapData(metric, company));
    }

    if (data.group_stats) {
      return mapGroupStatsToTreemapData(data.group_stats, boxType, sizeMetric);
    }

    return [];
  }, [data, metric, boxType, sizeMetric]);

  const handleBoxTypeChange = useCallback(
    (value: string | number | boolean) => {
      if (value === "company") {
        setSizeMetric("market_cap");
      }

      setBoxType(value as BoxType);
    },
    []
  );

  const handleSizeMetricChange = useCallback(
    (value: string | number | boolean) => {
      setSizeMetric(value as SizeMetric);
    },
    []
  );

  const filteredSizeOptions = useMemo(() => {
    if (boxType === "company") {
      return companySizeOptions;
    }

    return groupSizeOptions;
  }, [boxType]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <WidgetTitle>Coverage Distribution</WidgetTitle>
        <WidgetActions>
          <TextSelect
            value={boxType}
            options={metricOptions}
            onChange={handleBoxTypeChange}
            placeholder="Select box type"
            testId="coverage-distribution-box-type"
          />
          <TextSelect
            value={sizeMetric}
            options={filteredSizeOptions}
            onChange={handleSizeMetricChange}
            placeholder="Select size metric"
            testId="coverage-distribution-size-metric"
          />
          <WidgetMaximizeButton />
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody>
        <div className={cn("h-96 md:h-full", isMaximized && "h-full")}>
          {isLoadingCoverageDistribution ? (
            <Skeleton className="size-full" />
          ) : treemapData.length > 0 ? (
            <CoverageTreemap
              data={treemapData}
              sizeMetric={boxType === "company" ? metric : sizeMetric}
            />
          ) : (
            <NoDataOverlay />
          )}
        </div>
      </WidgetBody>
    </WidgetWrapper>
  );
};

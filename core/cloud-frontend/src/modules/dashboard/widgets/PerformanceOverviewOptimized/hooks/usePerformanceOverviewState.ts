import { useCallback, useState } from "react";
import { PerformanceOverviewConfig } from "./usePerformanceOverviewConfig";

interface UsePerformanceOverviewStateParams {
  config: PerformanceOverviewConfig;
  defaultDisplayMetric: string;
  defaultBenchmarkId?: string;
}

export const usePerformanceOverviewState = ({
  config,
  defaultDisplayMetric,
  defaultBenchmarkId = "",
}: UsePerformanceOverviewStateParams) => {
  const [userGroupBy, setUserGroupBy] = useState<string | null>(null);
  const [selectedDisplayValue, setSelectedDisplayValue] =
    useState(defaultDisplayMetric);
  const [userBenchmarkId, setUserBenchmarkId] = useState<string | null>(null);
  const selectedBenchmarkId = userBenchmarkId ?? defaultBenchmarkId;

  const selectedGroupBy = userGroupBy ?? config.defaultGroupBy;

  const handleGroupByChange = useCallback(
    (value: string | number | boolean) => {
      setUserGroupBy(value as string);
      setSelectedDisplayValue(defaultDisplayMetric);
    },
    [defaultDisplayMetric]
  );

  const handleDisplayValueChange = useCallback(
    (value: string | number | boolean) => {
      setSelectedDisplayValue(value as string);
    },
    []
  );

  const handleBenchmarkChange = useCallback(
    (value: string | number | boolean) => {
      setUserBenchmarkId(value as string);
    },
    []
  );

  return {
    selectedGroupBy,
    handleGroupByChange,
    selectedDisplayValue,
    handleDisplayValueChange,
    selectedBenchmarkId,
    handleBenchmarkChange,
  };
};

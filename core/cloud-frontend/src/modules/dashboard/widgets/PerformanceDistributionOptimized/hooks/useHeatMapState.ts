import { useState, useMemo } from "react";
import { HeatMapConfig } from "./useHeatMapConfig";

export const useHeatMapState = (config: HeatMapConfig) => {
  const [selectedGroupBy, setSelectedGroupBy] = useState<string | null>(null);

  const effectiveGroupBy = useMemo(() => {
    if (selectedGroupBy) {
      return selectedGroupBy;
    }

    if (config.defaultGroupBy) {
      return config.defaultGroupBy;
    }

    return config.groupByMetrics[0] || "";
  }, [selectedGroupBy, config.defaultGroupBy, config.groupByMetrics]);

  return {
    selectedGroupBy,
    setSelectedGroupBy,
    effectiveGroupBy,
  };
};

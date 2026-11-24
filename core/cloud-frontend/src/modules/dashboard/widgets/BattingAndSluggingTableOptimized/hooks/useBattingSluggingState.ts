import { useState, useMemo } from "react";
import { BattingSluggingConfig } from "./useBattingSluggingConfig";

export const useBattingSluggingState = (
  config: BattingSluggingConfig,
  defaultGroupBy?: string
) => {
  const defaultGroupByMetric = useMemo(() => {
    if (defaultGroupBy) return defaultGroupBy;
    return config.selectableDimensions[0] || "primary_analyst";
  }, [defaultGroupBy, config.selectableDimensions]);

  const [selectedGroupBy, setSelectedGroupBy] = useState(defaultGroupByMetric);

  const effectiveGroupBy = useMemo(() => {
    if (selectedGroupBy) return selectedGroupBy;
    return defaultGroupByMetric;
  }, [selectedGroupBy, defaultGroupByMetric]);

  return {
    selectedGroupBy,
    setSelectedGroupBy,
    effectiveGroupBy,
  };
};

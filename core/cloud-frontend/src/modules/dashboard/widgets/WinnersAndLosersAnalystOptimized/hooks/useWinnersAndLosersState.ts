import { useState, useMemo, useCallback } from "react";
import type { TopWinnersAndLosersAnalystRequestTopN } from "@/api/types";
import { WinnersAndLosersConfig } from "./useWinnersAndLosersConfig";

export interface WinnersAndLosersSelection {
  top: TopWinnersAndLosersAnalystRequestTopN;
  groupBy: string;
}

interface UseWinnersAndLosersStateParams {
  config: WinnersAndLosersConfig;
}

export const useWinnersAndLosersState = ({
  config,
}: UseWinnersAndLosersStateParams) => {
  const [selection, setSelection] = useState<WinnersAndLosersSelection>({
    top: config.topN,
    groupBy: config.defaultGroupBy,
  });

  const handleSelectionChange = useCallback(
    (key: keyof WinnersAndLosersSelection) =>
      (value: string | number | boolean) => {
        setSelection((prev) => {
          if (key === "top") {
            return {
              ...prev,
              top: String(value) as TopWinnersAndLosersAnalystRequestTopN,
            };
          }
          return { ...prev, groupBy: String(value) };
        });
      },
    []
  );

  const validatedTop = useMemo(() => {
    const supported = config.supportedTopN ?? [];
    if (!supported.length) return config.topN;
    return supported.includes(selection.top) ? selection.top : config.topN;
  }, [selection.top, config.supportedTopN, config.topN]);

  const validatedGroupBy = useMemo(() => {
    const supported = config.selectableDimensions ?? [];
    if (!supported.length) return config.defaultGroupBy;
    return supported.includes(selection.groupBy)
      ? selection.groupBy
      : config.defaultGroupBy;
  }, [selection.groupBy, config.selectableDimensions, config.defaultGroupBy]);

  return {
    selection: {
      ...selection,
      top: validatedTop,
      groupBy: validatedGroupBy,
    },
    handleSelectionChange,
  };
};

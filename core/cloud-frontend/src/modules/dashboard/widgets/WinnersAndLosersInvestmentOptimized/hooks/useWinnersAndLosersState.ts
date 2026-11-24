import { useState, useMemo, useCallback } from "react";
import type { TopWinnersAndLosersInvestmentRequestTopN } from "@/api/types";
import { WinnersAndLosersConfig } from "./useWinnersAndLosersConfig";

export interface WinnersAndLosersSelection {
  top: TopWinnersAndLosersInvestmentRequestTopN;
}

interface UseWinnersAndLosersStateParams {
  config: WinnersAndLosersConfig;
}

export const useWinnersAndLosersState = ({
  config,
}: UseWinnersAndLosersStateParams) => {
  const [selection, setSelection] = useState<WinnersAndLosersSelection>({
    top: config.topN,
  });

  const handleSelectionChange = useCallback(
    (key: keyof WinnersAndLosersSelection) =>
      (value: string | number | boolean) => {
        setSelection((prev) => {
          if (key === "top") {
            return {
              ...prev,
              top: String(value) as TopWinnersAndLosersInvestmentRequestTopN,
            };
          }
          return prev;
        });
      },
    []
  );

  const validatedTop = useMemo(() => {
    const supported = config.supportedTopN ?? [];
    if (!supported.length) return config.topN;
    return supported.includes(selection.top) ? selection.top : config.topN;
  }, [selection.top, config.supportedTopN, config.topN]);

  return {
    selection: {
      ...selection,
      top: validatedTop,
    },
    handleSelectionChange,
  };
};

import { ReactNode, useCallback, useMemo, useState } from "react";
import { MetricFlags } from "@typings/MetricFlags";
import { MetricFlagsContext } from "./MetricFlagsContext";

export interface MetricFlagsProviderProps {
  children?: ReactNode;
  defaultMetricFlags?: MetricFlags;
}

export const MetricFlagsProvider = ({
  children,
  defaultMetricFlags,
}: MetricFlagsProviderProps) => {
  const [metricFlags, setMetricFlags] = useState<MetricFlags>(
    defaultMetricFlags ?? {}
  );

  const resetMetricFlags = useCallback(() => {
    setMetricFlags(defaultMetricFlags ?? {});
  }, [defaultMetricFlags, setMetricFlags]);

  const context = useMemo(
    () => ({
      metricFlags,
      setMetricFlags,
      resetMetricFlags,
    }),
    [metricFlags, resetMetricFlags, setMetricFlags]
  );

  return (
    <MetricFlagsContext.Provider value={context}>
      {children}
    </MetricFlagsContext.Provider>
  );
};

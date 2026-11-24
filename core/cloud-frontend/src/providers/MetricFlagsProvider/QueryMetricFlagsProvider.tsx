import { z } from "zod";
import { ReactNode, useCallback, useMemo } from "react";
import { parseAsJson, useQueryState } from "nuqs";
import { MetricFlags } from "@typings/MetricFlags";
import { MetricFlagsContext } from "./MetricFlagsContext";

const metricFlagsSchema = z.object({
  explode_composites: z.boolean().optional(),
  idea_tracker: z.boolean().optional(),
});

export interface QueryMetricFlagsProviderProps {
  children?: ReactNode;
  defaultMetricFlags?: MetricFlags;
}

export const QueryMetricFlagsProvider = ({
  children,
  defaultMetricFlags,
}: QueryMetricFlagsProviderProps) => {
  const [metricFlags, setMetricFlags] = useQueryState<MetricFlags>(
    "metric-flags",
    parseAsJson(metricFlagsSchema.parse).withDefault(defaultMetricFlags ?? {})
  );

  const resetMetricFlags = useCallback(() => {
    setMetricFlags(defaultMetricFlags ?? {});
  }, [defaultMetricFlags, setMetricFlags]);

  const context = useMemo(
    () => ({ metricFlags, resetMetricFlags, setMetricFlags }),
    [metricFlags, resetMetricFlags, setMetricFlags]
  );

  return (
    <MetricFlagsContext.Provider value={context}>
      {children}
    </MetricFlagsContext.Provider>
  );
};

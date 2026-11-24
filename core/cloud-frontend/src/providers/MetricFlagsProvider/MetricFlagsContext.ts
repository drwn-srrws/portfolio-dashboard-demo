import { createContext, useContext } from "react";
import { MetricFlags } from "@typings/MetricFlags";

export interface IMetricFlagsContext {
  metricFlags: MetricFlags;
  setMetricFlags: (metricFlags: MetricFlags) => void;
  resetMetricFlags: () => void;
}

export const MetricFlagsContext = createContext<IMetricFlagsContext>({
  metricFlags: {},
  setMetricFlags: () => {},
  resetMetricFlags: () => {},
});

export const useMetricFlags = () => useContext(MetricFlagsContext);

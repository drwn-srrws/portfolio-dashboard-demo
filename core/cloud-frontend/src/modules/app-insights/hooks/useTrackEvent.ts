import { useCallback } from "react";

import { useAppInsights } from "@/modules/app-insights/providers/AppInsightsProvider";

export const useTrackEvent = (
  name: string,
  options?: Record<string, unknown>
) => {
  const { analyticsClient } = useAppInsights();

  const trackEvent = useCallback(
    (properties?: Record<string, unknown>) => {
      analyticsClient.trackEvent(name, {
        custom: true,
        ...options,
        ...properties,
      });
    },
    [analyticsClient, name, options]
  );

  return trackEvent;
};

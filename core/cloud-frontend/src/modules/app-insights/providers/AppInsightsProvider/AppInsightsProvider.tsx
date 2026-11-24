import { ReactNode, useEffect, useMemo } from "react";

import {
  analyticsClient,
  mockAnalyticsClient,
} from "@modules/app-insights/utils/AnalyticsClient";

import { useConfig, useGitRelease } from "@providers/ConfigProvider";
import { AppInsightsContext } from "./AppInsightsContext";

const isDevMode = import.meta.env.DEV;
const isLocalhost = window.location.hostname === "localhost";
const isCI = import.meta.env.VITE_PUBLIC_IS_CI === "true";

export interface AppInsightsProviderProps {
  children: ReactNode;
}

export const AppInsightsProvider = ({ children }: AppInsightsProviderProps) => {
  const { hedClient, analytics, hedEnv } = useConfig();
  const gitRelease = useGitRelease();

  const isTrackingDisabled =
    isDevMode || isLocalhost || hedEnv === "localdev" || isCI;

  const contextValue = useMemo(() => {
    if (isTrackingDisabled) return { analyticsClient: mockAnalyticsClient };
    return { analyticsClient };
  }, [isTrackingDisabled]);

  useEffect(() => {
    if (isTrackingDisabled) return;

    analyticsClient.initialize({
      hedEnv,
      hedClient,
      connectionStringMap: analytics.connectionStringMap,
      appVersion: gitRelease?.GIT_RELEASE_REF,
    });
  }, [analytics, gitRelease, hedClient, hedEnv, isTrackingDisabled]);

  return (
    <AppInsightsContext.Provider value={contextValue}>
      {children}
    </AppInsightsContext.Provider>
  );
};

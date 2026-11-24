import { createContext } from "react";
import { analyticsClient, IAnalyticsClient } from "../../utils/AnalyticsClient";

export interface IAppInsightsContext {
  analyticsClient: IAnalyticsClient;
}

export const AppInsightsContext = createContext<IAppInsightsContext>({
  analyticsClient: analyticsClient,
});

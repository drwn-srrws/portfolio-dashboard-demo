import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RequireFeatureFlags } from "@components/RequireFeatureFlags";
import { AppInsightsProvider } from "@/modules/app-insights/providers/AppInsightsProvider";
import { DockviewProvider } from "@/providers/DockviewProvider";
import { AuthProvider } from "@modules/auth/providers/AuthProvider";
import { ConfigProvider } from "@providers/ConfigProvider";
import { JotaiProvider } from "@/providers/JotaiProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { UserSettingsProvider } from "@/providers/UserSettingsProvider";
import { ConfirmProvider } from "@/providers/ConfirmProvider";
import ErrorBoundary from "../ErrorBoundary";
import { GlobalErrorOverlay } from "../Overlay/GlobalErrorOverlay";

export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <ErrorBoundary fallback={() => <GlobalErrorOverlay />}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider>
            <AuthProvider>
              <AppInsightsProvider>
                <RequireFeatureFlags>
                  <JotaiProvider>
                    <DockviewProvider>
                      <UserSettingsProvider>
                        <ConfirmProvider>{children}</ConfirmProvider>
                      </UserSettingsProvider>
                    </DockviewProvider>
                  </JotaiProvider>
                </RequireFeatureFlags>
              </AppInsightsProvider>
            </AuthProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

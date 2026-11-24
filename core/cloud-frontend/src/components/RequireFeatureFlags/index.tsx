import { ReactNode } from "react";

import type { Config, FeatureFlagName } from "@/config/types";
import { useConfig } from "@providers/ConfigProvider";

export interface RequireFeatureFlagsProps {
  children: ReactNode;
}

const requiredFeatureFlags: FeatureFlagName[] = ["enableEventTrackerChatbot"];

const getMissingFeatureFlags = (
  featureFlags: NonNullable<Config["featureFlags"]>
) => requiredFeatureFlags.filter((name) => !featureFlags[name]);

export const RequireFeatureFlags = ({ children }: RequireFeatureFlagsProps) => {
  const envVars = useConfig();

  const featureFlags = envVars?.featureFlags;

  const missingFeatureFlags =
    featureFlags && getMissingFeatureFlags(featureFlags);

  if (missingFeatureFlags && missingFeatureFlags.length) {
    throw new Error(
      `Required feature flags are not loaded: ${missingFeatureFlags.join(", ")}`
    );
  }

  return children;
};

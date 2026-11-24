import { useCallback } from "react";
import { useAuth } from "@modules/auth/providers/AuthProvider";
import type { FeatureFlagName } from "@/config/types";
import { useConfig } from "@providers/ConfigProvider";
import { hasRole } from "@utils/roleUtils";
import { RoleKinds } from "@typings/Role";

export const useFeatureFlags = () => {
  const { featureFlags } = useConfig();
  const { account: user } = useAuth();
  const isFeatureEnabled = useCallback(
    (name: FeatureFlagName) => {
      const featureFlag = featureFlags?.[name];
      if (!featureFlag) return false;
      const allowedEmails = featureFlag.auth?.allowedEmails ?? [];
      const deniedEmails = featureFlag.auth?.deniedEmails ?? [];
      const allowedRoles = featureFlag.auth?.allowedRoles ?? [];
      const isAllowedEmail =
        (user?.email && allowedEmails.includes(user.email)) ||
        !allowedEmails.length;
      const isDeniedEmail = user?.email && deniedEmails.includes(user.email);

      const isAllowedRole = hasRole(user?.roles, allowedRoles as RoleKinds[]);

      return (
        featureFlag.enabled && isAllowedEmail && !isDeniedEmail && isAllowedRole
      );
    },
    [featureFlags, user]
  );
  return { isFeatureEnabled };
};

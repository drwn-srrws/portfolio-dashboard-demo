import { useMemo } from "react";
import { LoginResponse } from "@api/types";
import { useConfig } from "../providers/ConfigProvider/useConfig";
import { useAuth } from "../modules/auth/providers/AuthProvider/useAuth";

export const useNavItems = () => {
  const { account } = useAuth();
  const { navItems } = useConfig();
  const user = account as LoginResponse;
  const authorizedNavItems = useMemo(() => {
    if (!user.roles.length || !user.email) return [];

    const userRoleNames = user.roles.map((role) => role.name);

    const filteredNavItems = navItems.filter(
      (item) =>
        !item.roles || item.roles.some((role) => userRoleNames.includes(role))
    );
    return filteredNavItems.map((group) => ({
      ...group,
      children: group.children?.filter((child) => {
        if (!child.auth) return true;
        if (child.auth.deniedEmails && child.auth.deniedEmails.length > 0) {
          return !child.auth.deniedEmails.includes(user.email);
        }
        if (child.auth.deniedRoles && child.auth.deniedRoles.length > 0) {
          return !child.auth.deniedRoles.some((role) =>
            userRoleNames.includes(role)
          );
        }
        if (child.auth.allowedEmails && child.auth.allowedEmails.length > 0) {
          return child.auth.allowedEmails.includes(user.email);
        }
        if (!child.auth.allowedRoles) return true;
        return child.auth.allowedRoles.some((role) =>
          userRoleNames.includes(role)
        );
      }),
    }));
  }, [navItems, user.email, user.roles]);
  const filteredNavItems = useMemo(
    () => authorizedNavItems.filter((item) => item.children?.length > 0),
    [authorizedNavItems]
  );
  return { navItems: filteredNavItems };
};

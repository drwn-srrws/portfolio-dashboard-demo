import { useMemo } from "react";
import { Outlet } from "react-router";
import { RoleKinds } from "@typings/Role";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { LoginResponse } from "@api/types";
import { Unauthorized } from "@components/Unauthorized";
import { hasRole } from "@utils/roleUtils";

export interface AccessGuardProps {
  allowedRoles?: RoleKinds[];
  allowedEmails?: string[];
  deniedEmails?: string[];
}

export const AccessGuard = ({
  allowedRoles,
  allowedEmails,
  deniedEmails,
}: AccessGuardProps) => {
  const { account } = useAuth();

  const user = account as LoginResponse;

  const isAuthorized = useMemo(() => {
    if (allowedEmails && allowedEmails.length > 0) {
      return allowedEmails.includes(user.email);
    }

    if (deniedEmails && deniedEmails.length > 0) {
      return !deniedEmails.includes(user.email);
    }

    if (allowedRoles) {
      return hasRole(user.roles, allowedRoles as RoleKinds[]);
    }

    return true;
  }, [allowedEmails, allowedRoles, deniedEmails, user]);

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return <Outlet />;
};

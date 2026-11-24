import { LoginRole } from "@api/types";
import { RoleKinds } from "@typings/Role";

export const hasRole = (
  userRoles?: LoginRole[] | undefined,
  requiredRoles?: RoleKinds[]
): boolean => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRoles) return false;

  return (
    userRoles?.some((role) => requiredRoles.includes(role.name as RoleKinds)) ??
    false
  );
};

export const isAdmin = (userRoles?: LoginRole[] | undefined): boolean => {
  return hasRole(userRoles, [RoleKinds.Admin]);
};

export const isPortfolioManagerReadOnly = (
  userRoles?: LoginRole[] | undefined
): boolean => {
  return hasRole(userRoles, [RoleKinds.PortfolioManagerReadOnly]);
};

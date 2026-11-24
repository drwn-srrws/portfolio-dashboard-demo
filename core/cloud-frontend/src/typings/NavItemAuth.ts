import { RoleKinds } from "./Role";

export interface NavItemAuth {
  allowedRoles?: RoleKinds[];
  deniedRoles?: RoleKinds[];
  allowedEmails?: string[];
  deniedEmails?: string[];
}

import { IconNameType } from "@/components/Icon/Icon";
import { NavItem } from "./NavItem";
import { RoleKinds } from "./Role";

export interface NavItemGroup {
  text: string;
  icon: IconNameType;
  roles?: RoleKinds[];
  children: NavItem[];
}

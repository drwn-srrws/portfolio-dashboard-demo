import { IconNameType } from "@/components/Icon/Icon";
import { NavItemAuth } from "./NavItemAuth";

export interface NavItem<T extends object = object> {
  text: string;
  url: string;
  id?: string;
  icon?: IconNameType;
  type?: "page";
  metadata?: {
    title?: string;
  };
  auth?: NavItemAuth;
  data?: T;
  props?: Record<string, unknown>;
}

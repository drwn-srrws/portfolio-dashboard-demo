import { NavItem } from "@/typings/NavItem";

export interface NavItemProps<T extends object = object> {
  disableGutters?: boolean;
  data: NavItem<T>;
  onSelect?: () => void;
}

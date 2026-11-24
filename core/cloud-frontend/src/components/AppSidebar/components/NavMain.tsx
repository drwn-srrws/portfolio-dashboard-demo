import { NavItemGroup } from "@/typings/NavItemGroup";
import { SidebarGroup, SidebarMenu, useSidebar } from "@components/ui/sidebar";
import { NavMainCollapsibleItem } from "./NavMainCollapsibleItem";
import { NavMainDropdownItem } from "./NavMainDropdownItem";

export interface NavMainProps {
  groups: NavItemGroup[];
}

export function NavMain({ groups }: NavMainProps) {
  const { open, openMobile } = useSidebar();

  const NavMainItem =
    open || openMobile ? NavMainCollapsibleItem : NavMainDropdownItem;

  return (
    <SidebarGroup className="pt-0">
      <SidebarMenu>
        {groups.map((group) => (
          <NavMainItem key={group.text} group={group} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

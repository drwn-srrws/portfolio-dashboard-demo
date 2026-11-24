import { ChevronDown } from "lucide-react";

import { Icon } from "@/components/Icon/Icon";
import { NavItemGroup } from "@/typings/NavItemGroup";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem } from "@components/ui/sidebar";
import { NavMenuSub } from "./NavMenuSub";

export interface NavMainCollapsibleItemProps {
  group: NavItemGroup;
}

export const NavMainCollapsibleItem = ({
  group,
}: NavMainCollapsibleItemProps) => (
  <SidebarMenuItem>
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton>
          {group.icon && (
            <Icon name={group.icon} size="lg" color="currentColor" />
          )}
          <span className="line-clamp-1 text-sm uppercase">{group.text}</span>
          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 " />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NavMenuSub data={group} />
      </CollapsibleContent>
    </Collapsible>
  </SidebarMenuItem>
);

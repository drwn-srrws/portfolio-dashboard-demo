import { useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/Icon/Icon";
import { NavItemGroup } from "@/typings/NavItemGroup";
import {
  SidebarIconMenuItem,
  SidebarIconMenuItemIcon,
  SidebarIconMenuItemText,
} from "@components/ui/sidebar";

import { NavMenuSub } from "./NavMenuSub";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";

export interface NavMainDropdownItemProps {
  group: NavItemGroup;
}

export const NavMainDropdownItem = ({ group }: NavMainDropdownItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <SidebarIconMenuItem>
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenuTrigger asChild>
              <SidebarIconMenuItemIcon>
                <Icon name={group.icon} size="lg" color="currentColor" />
              </SidebarIconMenuItemIcon>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          {!open &&
            createPortal(
              <TooltipContent className="z-[2000] ml-1" side="right">
                {group.text}
              </TooltipContent>,
              document.body
            )}
        </Tooltip>
        <SidebarIconMenuItemText>{group.text}</SidebarIconMenuItemText>
      </SidebarIconMenuItem>

      {createPortal(
        <DropdownMenuContent
          side="right"
          className="z-[1000] w-64 rounded-lg border bg-background p-1"
        >
          <NavMenuSub
            disableGutters
            data={group}
            onSelect={() => setOpen(false)}
          />
        </DropdownMenuContent>,
        document.body
      )}
    </DropdownMenu>
  );
};

import { useLocation } from "react-router-dom";

import { NavItemGroup } from "@/typings/NavItemGroup";
import { NavItem } from "@/typings/NavItem";
import { useConfig } from "@/providers/ConfigProvider/useConfig";
import { useMemo } from "react";

export const usePageConfig = () => {
  const pathname = useLocation().pathname;
  const { navItems } = useConfig();

  const group = useMemo(() => {
    return navItems.find((group) => {
      return group.children?.find((item) => item.url === pathname);
    });
  }, [navItems, pathname]);

  const page = useMemo(() => {
    return group?.children?.find((item) => item.url === pathname);
  }, [group, pathname]);

  return {
    group: group as NavItemGroup,
    page: page as NavItem,
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from "react";
import { NavItem } from "@/typings/NavItem";
import { PageNavItem } from "../nav-items/PageNavItem";
import { NavItemProps } from "../types/NavItemProps";

export const navItemMap: Record<
  NonNullable<NavItem["type"]>,
  FC<NavItemProps<any>>
> = {
  page: PageNavItem,
};

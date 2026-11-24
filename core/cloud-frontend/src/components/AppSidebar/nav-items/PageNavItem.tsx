import { Link, useLocation } from "react-router";
import { cn } from "@/utils";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@components/ui/sidebar";
import { NavItemProps } from "../types/NavItemProps";

const isPathActive = (currentPath: string, navPath: string): boolean => {
  return new RegExp(`^${navPath}($|/)`).test(currentPath);
};

const isExternalUrl = (url: string): boolean => url.startsWith("http");

export const PageNavItem = ({
  disableGutters,
  data,
  onSelect,
}: NavItemProps) => {
  const { pathname } = useLocation();
  const external = isExternalUrl(data.url);
  const link = (
    <span className="line-clamp-1 whitespace-nowrap text-[1rem]">
      {data.text}
    </span>
  );

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={!external && isPathActive(pathname, data.url)}
        className={cn(!disableGutters && "pl-8")}
      >
        {external ? (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSelect}
          >
            {link}
          </a>
        ) : (
          <Link to={data.url} onClick={onSelect}>
            {link}
          </Link>
        )}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};

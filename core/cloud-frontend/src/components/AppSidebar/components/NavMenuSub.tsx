import { useSidebar } from "@components/ui/sidebar";
import { NavItemGroup } from "@/typings/NavItemGroup";
import { navItemMap } from "../constants/navItemMap";
import { useIsMobile } from "@/hooks/useMobile";
import { SidebarMenuSub } from "@components/ui/sidebar";

export interface NavMenuSubProps {
  disableGutters?: boolean;
  data: NavItemGroup;
  onSelect?: () => void;
}

export const NavMenuSub = ({
  data,
  disableGutters,
  onSelect,
}: NavMenuSubProps) => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const onSelectMobile = () => {
    if (isMobile) {
      toggleSidebar();
      onSelect?.();
    } else {
      onSelect?.();
    }
  };

  return (
    <SidebarMenuSub className="mx-0 border-l-0 px-0">
      {data.children?.map((item) => {
        const NavItemComponent = navItemMap[item.type ?? "page"];

        return (
          <NavItemComponent
            key={item.url}
            disableGutters={disableGutters}
            data={item}
            onSelect={onSelectMobile}
          />
        );
      })}
    </SidebarMenuSub>
  );
};

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@components/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@components/ui/sidebar";
import { useNavItems } from "@/hooks/useNavItems";
import { cn } from "@/utils/utils";
import { DataAvailabilityButton } from "@/components/DataAvailabilityButton";
import { NavMain } from "./components/NavMain";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open: openDesktop, openMobile, toggleSidebar } = useSidebar();
  const { navItems } = useNavItems();

  const open = openDesktop || openMobile;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <img
          src={open ? import.meta.env.BASE_URL + "brand-full.svg" : import.meta.env.BASE_URL + "brand-small.svg"}
          alt="Brand Logo"
          width={107}
          height={32}
          className={open ? "h-11 pl-2 pt-4" : "size-10 mt-2"}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navItems} />
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:py-3.5">
        <div
          className={cn(
            "mb-2",
            open
              ? "px-2 space-y-2"
              : "flex flex-col items-center justify-center space-y-2"
          )}
        >
          <DataAvailabilityButton />
        </div>
        <div
          className="flex flex-row items-center justify-between"
          data-testid="sidebar-open-close-button"
        >
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "aspect-square p-0 transition-all",
              // Need to use explicit px value to achieve nice animation
              open ? "size-10" : "size-10 ml-1"
            )}
            onClick={toggleSidebar}
          >
            {open ? (
              <ArrowLeft className="size-5" />
            ) : (
              <ArrowRight className="size-5" />
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

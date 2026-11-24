import { useState } from "react";
import { Icon } from "@components/Icon/Icon";
import { useSidebar } from "@components/ui/sidebar";
import { cn } from "@/utils/utils";
import { Tooltip } from "@components/Tooltip/Tooltip";
import { useGetLatestDataDates } from "@/api/endpoints/data/data";
import { DataAvailabilityModal } from "./components";

export function DataAvailabilityButton() {
  const [open, setOpen] = useState(false);
  const { open: sidebarOpenDesktop, openMobile: sidebarOpenMobile } =
    useSidebar();

  const { data: latestDatesData, isLoading, error } = useGetLatestDataDates();

  const sidebarOpen = sidebarOpenDesktop || sidebarOpenMobile;

  return (
    <>
      <Tooltip
        trigger={
          <div
            className={cn(
              "flex items-center rounded-md border border-[hsl(var(--muted))] cursor-pointer hover:bg-sidebar-accent transition-colors w-full",
              sidebarOpen
                ? "px-3 py-2 gap-2 justify-start w-full"
                : "size-9 justify-center"
            )}
            onClick={() => setOpen(true)}
          >
            <Icon name="Info" color="currentColor" size="lg" />
            {sidebarOpen && (
              <span className="text-sm line-clamp-1">Data Availability</span>
            )}
          </div>
        }
        content={<div className="text-sm font-medium">Data Availability</div>}
        contentClasses="bg-neutral-800 text-white p-2 rounded max-w-[20rem] break-words border border-neutral-600 shadow-md"
        triggerClasses={cn(sidebarOpen && "w-full")}
        side="top"
      />

      <DataAvailabilityModal
        open={open}
        onOpenChange={setOpen}
        data={latestDatesData}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

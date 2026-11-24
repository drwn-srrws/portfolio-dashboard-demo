import { ChevronDown, Loader2 } from "lucide-react";
import { ReactNode } from "react";

import { Icon, IconNameType } from "@/components/Icon/Icon";
import { usePanel } from "@/providers/PanelProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { toast } from "@components/ui/use-toast";
import { useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export interface WidgetTitleProps {
  children?: ReactNode;
  exportToCSV?: (name: string) => void;
  exportAllToCSV?: (name: string) => void;
  isExportingAll?: boolean;
}

export interface MenuItem {
  iconName: string;
  actionLabel: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const WidgetTitle = ({
  children,
  exportToCSV,
  exportAllToCSV,
  isExportingAll = false,
}: WidgetTitleProps) => {
  const props = usePanel();

  const isSystemTitle = props.api.title?.includes("panel_");
  const title = isSystemTitle ? children : props.api.title;
  const isExportable = typeof exportToCSV === "function";
  const hasExportAll = typeof exportAllToCSV === "function";

  const handleExportToCSV = () => {
    if (exportToCSV) {
      exportToCSV(title as string);
    } else {
      toast({
        title: "Export to CSV is not available for this card",
        variant: "destructive",
      });
    }
  };

  const handleExportAllToCSV = () => {
    if (exportAllToCSV) {
      exportAllToCSV(title as string);
    }
  };

  const menuItems: MenuItem[] = hasExportAll
    ? [
        {
          iconName: "Download",
          actionLabel: "Export Page to CSV",
          onClick: handleExportToCSV,
          disabled: !isExportable,
        },
        {
          iconName: "Download",
          actionLabel: "Export All to CSV",
          onClick: handleExportAllToCSV,
          disabled: isExportingAll,
          isLoading: isExportingAll,
        },
      ]
    : [
        {
          iconName: "Download",
          actionLabel: "Export to CSV",
          onClick: handleExportToCSV,
          disabled: !isExportable,
        },
      ];

  const location = useLocation();

  const isDropdownDisabled =
    location.pathname.includes("universe-dashboard") ||
    location.pathname.includes("coverage-universe");

  return (
    <div className="flex items-center min-w-[45px] overflow-hidden">
      <TooltipProvider>
        <Tooltip delayDuration={600}>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger
                className="flex items-center gap-2 min-w-0"
                disabled={isDropdownDisabled}
              >
                <span
                  className="text-base font-medium text-neutral-400 export-to-csv-announcement truncate"
                  data-testid="widget-title"
                >
                  {title}
                </span>
                {!isDropdownDisabled && (
                  <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                )}
              </DropdownMenuTrigger>
            </TooltipTrigger>

            <DropdownMenuContent data-testid="widget-title-context-menu">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  data-testid={`${item.actionLabel}`}
                  key={item.actionLabel}
                  className="focus:bg-neutral-600"
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  {item.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon
                      name={item.iconName as IconNameType}
                      color="currentColor"
                      size="lg"
                    />
                  )}
                  <span className="pl-3">{item.actionLabel}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipPortal>
            <TooltipContent
              side="top"
              className="bg-neutral-800 text-white p-2 rounded max-w-[400px] break-words border border-neutral-600 shadow-md z-[9999]"
            >
              <div className="text-sm">{title}</div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

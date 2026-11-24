import { useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { Icon } from "@/components/Icon/Icon";

import { EstimateCellValue } from "../../types/EstimateTypes";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { EstimateTooltip } from "../../components/estimates/components/EstimateTooltip";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import { ExtendedEventResponse } from "../../components/EventsMonitorGrid/EventsMonitorDetailGrid";
import { EstimateModalPrefilledData } from "../../types/EstimateModalTypes";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";

export const ImpliedEstimateCell = ({
  value,
  data,
}: CustomCellRendererProps<ExtendedEventResponse, EstimateCellValue>) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { updateDialog } = useStore();
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);

  const eventId = value?.eventId || data?.id || 0;

  const estimates = useMemo(() => data?.estimates || [], [data?.estimates]);

  const handleTooltipOpenChange = useCallback((open: boolean) => {
    setTooltipOpen(open);
  }, []);

  const handleEstimateClick = useCallback(() => {
    if (!eventId || !data) return;

    const prefilledData: EstimateModalPrefilledData = {
      eventId,
      companyId: data.company_id,
      companyName: data.company_name,
      estimates,
      primaryAnalyst: data.primary_analyst || undefined,
    };

    updateDialog({
      dialog: Dialogs.createEstimateDialog,
      status: true,
      prefilled: prefilledData,
    });

    setTooltipOpen(false);
  }, [eventId, data, estimates, updateDialog]);

  const handleCreateEstimate = useCallback(() => {
    handleEstimateClick();
  }, [handleEstimateClick]);

  if (!value) return <span className="text-neutral-400">-</span>;

  const { type, displayValue } = value;

  const estimateTooltipPortal = createPortal(
    <TooltipContent
      side="right"
      className="z-50 backdrop-blur-md shadow-2xl rounded-xl bg-neutral-800 max-w-[320px] text-white"
    >
      <EstimateTooltip type={type} estimates={estimates} />
    </TooltipContent>,
    document.body
  );

  if (readOnly) {
    if (displayValue == null && estimates.length > 0) {
      return (
        <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
          <TooltipTrigger asChild>
            <span className="text-neutral-500 text-xs cursor-default select-none">
              No primary
            </span>
          </TooltipTrigger>
          {estimateTooltipPortal}
        </Tooltip>
      );
    }
    return (
      <span
        className={displayValue == null ? "text-neutral-400" : "text-white"}
      >
        {displayValue ?? "-"}
      </span>
    );
  }

  return (
    <>
      {displayValue == null ? (
        <div className="flex items-center gap-2 size-full">
          {estimates.length > 0 ? (
            <>
              <Tooltip
                open={tooltipOpen}
                onOpenChange={handleTooltipOpenChange}
              >
                <TooltipTrigger asChild>
                  <span className="text-neutral-500 text-xs cursor-default select-none whitespace-nowrap">
                    No primary
                  </span>
                </TooltipTrigger>
                {estimateTooltipPortal}
              </Tooltip>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCreateEstimate}
              >
                <Icon name="Plus" size="lg" />
              </Button>
            </>
          ) : (
            <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCreateEstimate}
                >
                  <Icon name="Plus" size="lg" />
                </Button>
              </TooltipTrigger>
              {estimateTooltipPortal}
            </Tooltip>
          )}
        </div>
      ) : (
        <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full h-full justify-start p-0 hover:bg-transparent text-white"
              onClick={handleEstimateClick}
            >
              <span className="underline cursor-pointer text-white">
                {displayValue}
              </span>
            </Button>
          </TooltipTrigger>

          {displayValue != null && estimateTooltipPortal}
        </Tooltip>
      )}
    </>
  );
};

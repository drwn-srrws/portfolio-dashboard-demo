import { useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

import { cellColor } from "@utils/ag-grid/cells";
import { PriceTargetForm } from "@/modules/dashboard/widgets/CoverageUniverse/components/PriceTargetForm";
import {
  PriceTargetCellValue,
  PriceTargetType,
} from "../../types/PriceTargetTypes";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import { PriceTargetTooltip } from "../../components/PriceTarget/PriceTargetTooltip";
import {
  useCreatePriceTarget,
  useCreateDownsidePriceTarget,
} from "@/api/endpoints/company/company";
import { PriceTargetFormData } from "@/modules/dashboard/widgets/CoverageUniverse/components/PriceTargetForm/priceTargetSchema";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { ExtendedEventResponse } from "../../components/EventsMonitorGrid/EventsMonitorDetailGrid";
import { useChangeHistory } from "../../../../providers/ChangeHistoryProvider";

const priceTargetCellTypeColor: Record<PriceTargetType, string> = {
  upside: cellColor["positive"],
  downside: cellColor["negative"],
};

export const PriceTargetCell = ({
  value,
}: CustomCellRendererProps<ExtendedEventResponse, PriceTargetCellValue>) => {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);
  const { addHistoryEntry } = useChangeHistory();

  const currentUserPriceTarget = useMemo(() => {
    if (!value?.allPriceTargets || !account?.id) return null;

    return value.allPriceTargets.find(
      (target) => target.created_by.id === account.id
    );
  }, [value?.allPriceTargets, account?.id]);

  const defaultFormValue = useMemo(() => {
    const userTargetValue = currentUserPriceTarget?.price_target_usd ?? null;
    return userTargetValue ?? 0;
  }, [currentUserPriceTarget]);

  const createUpsidePriceTarget = useCreatePriceTarget({
    mutation: {
      onSuccess: () => {
        setOpen(false);
      },
    },
  });

  const createDownsidePriceTarget = useCreateDownsidePriceTarget({
    mutation: {
      onSuccess: () => {
        setOpen(false);
      },
    },
  });

  const handleTooltipOpenChange = useCallback(
    (open: boolean) => {
      if (!value?.allPriceTargets?.length) return setTooltipOpen(false);
      setTooltipOpen(open);
    },
    [value?.allPriceTargets]
  );

  const handleSave = useCallback(
    async (data: PriceTargetFormData) => {
      if (!value?.companyId || !data.priceTarget) return;

      const payload = {
        id: value.companyId,
        data: { price_target_usd: data.priceTarget },
      };

      if (value.type === "upside") {
        createUpsidePriceTarget.mutate(payload);
        addHistoryEntry({
          type: "update",
          entity: "price_target",
          title: "Upside Price Target Updated",
          description: `${value.companyName} - $${data.priceTarget}`,
          data: { companyId: value.companyId, type: "upside" },
        });
      } else {
        createDownsidePriceTarget.mutate(payload);
        addHistoryEntry({
          type: "update",
          entity: "price_target",
          title: "Downside Price Target Updated",
          description: `${value.companyName} - $${data.priceTarget}`,
          data: { companyId: value.companyId, type: "downside" },
        });
      }
    },
    [value, createUpsidePriceTarget, createDownsidePriceTarget, addHistoryEntry]
  );

  if (!value) return null;

  const { type, displayValue } = value;

  const isSaving =
    createUpsidePriceTarget.isPending || createDownsidePriceTarget.isPending;

  if (readOnly) {
    return (
      <span
        style={{
          color:
            displayValue != null ? priceTargetCellTypeColor[type] : undefined,
        }}
      >
        {displayValue != null ? (
          displayValue
        ) : (
          <span className="text-neutral-400">-</span>
        )}
      </span>
    );
  }

  return (
    <Tooltip open={tooltipOpen} onOpenChange={handleTooltipOpenChange}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full h-full justify-start p-0 hover:bg-transparent text-white"
            >
              {displayValue != null ? (
                <span
                  className="underline"
                  style={{ color: priceTargetCellTypeColor[type] }}
                >
                  {displayValue}
                </span>
              ) : (
                <span className="text-neutral-400">-</span>
              )}
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>

        <PopoverContent className="z-[10050] w-[220px] mt-[15px] rounded-[8px] bg-[#171717] p-4 text-white shadow-md border-neutral-700 border">
          <PriceTargetForm
            type={type}
            isSaving={isSaving}
            defaultValues={{ priceTarget: defaultFormValue }}
            onClose={() => setOpen(false)}
            onSave={handleSave}
          />
        </PopoverContent>
      </Popover>

      {value?.allPriceTargets?.length &&
        createPortal(
          <TooltipContent
            side="right"
            className="z-50 backdrop-blur-md shadow-2xl rounded-xl bg-neutral-800 max-w-[320px] text-white"
          >
            <PriceTargetTooltip
              type={type}
              allTargets={value?.allPriceTargets}
            />
          </TooltipContent>,
          document.body
        )}
    </Tooltip>
  );
};

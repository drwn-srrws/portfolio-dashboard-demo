import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn, numToDollar } from "@/utils";
import { cellColor } from "@utils/ag-grid/cells";
import { CompanyResponsePrimaryAnalystUpsidePriceTarget as IPriceTarget } from "@api/types";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui";
import { PriceTargetForm } from "../PriceTargetForm";
import { PriceTargetHint } from "../PriceTargetHint";
import { PriceTargetFormData } from "../PriceTargetForm/priceTargetSchema";

export type PriceTargetType = "upside" | "downside";

const priceTargetCellTypeColor: Record<PriceTargetType, string> = {
  upside: cellColor["positive"],
  downside: cellColor["negative"],
};

export interface PriceTargetDropdownProps {
  disableSave?: boolean;
  type: PriceTargetType;
  data: IPriceTarget | null;
  isSaving: boolean;
  open: boolean;
  testId?: string;
  onSave: (data: PriceTargetFormData) => void;
  onOpenChange?: (open: boolean) => void;
}

export const PriceTargetDropdown = ({
  disableSave,
  type,
  data,
  isSaving,
  open,
  testId,
  onSave,
  onOpenChange,
}: PriceTargetDropdownProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const defaultValues = useMemo(() => {
    const defaultValues: PriceTargetFormData = {
      priceTarget: data?.price_target_usd ?? 0,
    };

    return defaultValues;
  }, [data]);

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleClick = useCallback(() => {
    if (disableSave) return;
    onOpenChange?.(true);
  }, [disableSave, onOpenChange]);

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (disableSave) return;
      onOpenChange?.(open);
    },
    [disableSave, onOpenChange]
  );

  const handleTooltipOpenChange = useCallback(
    (open: boolean) => {
      if (!data) return setIsTooltipOpen(false);
      setIsTooltipOpen(open);
    },
    [data]
  );

  return (
    <Tooltip open={isTooltipOpen} onOpenChange={handleTooltipOpenChange}>
      <Popover open={open} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full h-full justify-start p-0 hover:bg-transparent",
                disableSave && "cursor-default"
              )}
              data-testid={`${testId}-trigger-dropdown`}
              onClick={handleClick}
            >
              {data ? (
                <span style={{ color: priceTargetCellTypeColor[type] }}>
                  {numToDollar(data.price_target_usd)}
                </span>
              ) : (
                "-"
              )}
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>

        <PopoverContent className="z-[10050] w-[220px] mt-[15px] rounded-[8px] bg-[#171717] p-4 text-white shadow-md border-neutral-700 border">
          <PriceTargetForm
            type={type}
            isSaving={isSaving}
            defaultValues={defaultValues}
            onClose={handleClose}
            onSave={onSave}
          />
        </PopoverContent>
      </Popover>

      {data &&
        createPortal(
          <TooltipContent
            side="right"
            className="z-50 backdrop-blur-md shadow-2xl rounded-xl w-fit bg-neutral-800 max-w-[277px] min-w-[150px]"
          >
            <PriceTargetHint type={type} data={data} />
          </TooltipContent>,
          document.body
        )}
    </Tooltip>
  );
};

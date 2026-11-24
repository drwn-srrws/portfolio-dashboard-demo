import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { CompanyResponsePrimaryAnalystRating as Rating } from "@api/types";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui";
import { Icon } from "@components/Icon/Icon";
import { RatingHint } from "../RatingHint";
import { getRatingInfo } from "../../constants/ratings";
import { RatingForm } from "../RatingForm";
import { RatingFormData } from "../RatingForm/ratingSchema";
import { cn } from "@/utils";

export interface RatingDropdownProps {
  data?: Rating;
  disableSave?: boolean;
  open: boolean;
  isSaving?: boolean;
  testId?: string;
  onSave: (data: RatingFormData) => void;
  onOpenChange?: (open: boolean) => void;
}

export const RatingDropdown = ({
  disableSave,
  data,
  open,
  isSaving,
  testId,
  onSave,
  onOpenChange,
}: RatingDropdownProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const ratingInfo = data && getRatingInfo(data.rating);

  const defaultValues = useMemo(() => {
    if (!data) return undefined;

    const defaultValues: RatingFormData = {
      rating: data.rating,
      comment: data.comment ?? "",
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
    <Tooltip
      open={isTooltipOpen && !!data}
      onOpenChange={handleTooltipOpenChange}
    >
      <Popover open={open} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              data-testid={`${testId}-trigger-dropdown`}
              variant="ghost"
              className={cn(
                "flex w-full h-full justify-start p-0 hover:bg-transparent",
                disableSave && "cursor-default"
              )}
              onClick={handleClick}
            >
              {ratingInfo ? (
                <div
                  className="flex items-center gap-2"
                  style={{ color: ratingInfo.color }}
                >
                  <Icon
                    name={ratingInfo.icon}
                    size="lg"
                    color={ratingInfo.color}
                  />
                  <span className="text-sm">{ratingInfo.text}</span>
                </div>
              ) : (
                <span>-</span>
              )}
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <PopoverContent className="z-[10050] w-auto mt-[15px] rounded-[8px] bg-[#171717] p-4 text-white shadow-md border-neutral-700 border">
          <RatingForm
            defaultValues={defaultValues}
            isSaving={isSaving}
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
            {!!data && !!ratingInfo && (
              <RatingHint
                name={ratingInfo.text}
                comment={data.comment}
                updatedAt={format(data.date, "MMM d, yyyy")}
              />
            )}
          </TooltipContent>,
          document.body
        )}
    </Tooltip>
  );
};

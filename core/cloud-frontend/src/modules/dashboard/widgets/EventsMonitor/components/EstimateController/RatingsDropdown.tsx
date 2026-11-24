import { useCallback, useState } from "react";
import {
  Popover as RadixPopover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Button } from "@components/ui/button";
import { RatingForm } from "./RatingForm";
import { GetRating } from "../../types/RatingTypes";

export interface Props {
  disableTicker?: boolean;
  open?: boolean;
  trigger: React.ReactElement;
  tickerName?: string;
  ratingSource: GetRating | undefined;
  deadlineDate: string | null;
  onOpenChange?: (open: boolean) => void;
  onUpdateRating: (rating: GetRating) => void;
}

export const RatingsDropdown = ({
  disableTicker,
  open: propOpen,
  trigger,
  ratingSource,
  tickerName,
  deadlineDate,
  onUpdateRating,
  onOpenChange,
}: Props) => {
  const [_open, _setOpen] = useState(false);

  const open = propOpen ?? _open;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!propOpen) _setOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange, propOpen]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <RadixPopover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild id="triger" className="w-full h-full">
        <Button
          variant="ghost"
          className="flex w-full h-full justify-start p-0 hover:bg-transparent "
        >
          {trigger}
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="z-[10050] w-[45rem] mt-3 rounded-[8px] bg-[#171717] p-2 text-white shadow-md border-neutral-700 border">
          <RatingForm
            disableTicker={disableTicker}
            tickerName={tickerName}
            deadlineDate={deadlineDate}
            ratingSource={ratingSource}
            onClose={handleClose}
            onUpdateRating={onUpdateRating}
          />
        </PopoverContent>
      </PopoverPortal>
    </RadixPopover>
  );
};

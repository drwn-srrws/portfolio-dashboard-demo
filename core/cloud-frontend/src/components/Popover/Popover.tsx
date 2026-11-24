import {
  Popover as RadixPopover,
  PopoverContent,
  PopoverTrigger,
  PopoverPortal,
} from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "@/utils/utils";

import { Button } from "@components/ui";

export interface PopoverProps {
  children: React.ReactElement;
  buttonText: React.ReactNode;
  usePortal?: boolean;
  className?: {
    button?: string;
    contentWrapper?: string;
  };
}

export const Popover = ({
  children,
  className,
  buttonText,
  usePortal = false,
}: PopoverProps) => {
  const content = (
    <PopoverContent
      className={cn(
        "z-50 w-64 rounded-md bg-black p-2 text-white shadow-md",
        className?.contentWrapper
      )}
      onWheel={(event) => event.stopPropagation()}
    >
      {children}
    </PopoverContent>
  );

  return (
    <RadixPopover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded text-[#B3B3B3] px-4 py-2 hover:bg-transparent hover:text-[#B3B3B3]",
            className?.button
          )}
        >
          {buttonText}
        </Button>
      </PopoverTrigger>

      {usePortal ? <PopoverPortal>{content}</PopoverPortal> : content}
    </RadixPopover>
  );
};

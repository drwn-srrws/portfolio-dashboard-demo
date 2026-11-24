import { FC } from "react";
import { FeatureDialogConfig } from "@/config/types";
import { useElementHighlight } from "./useElementHighlight";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { TooltipPortal } from "@radix-ui/react-tooltip";

interface FeatureDialogProps {
  config: FeatureDialogConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeatureDialog: FC<FeatureDialogProps> = ({
  config,
  open,
  onOpenChange,
}) => {
  const { activeElement } = useElementHighlight({
    isActive: open,
    targetSelector: config.targetSelector || ".interactive",
    onClose: () => onOpenChange(false),
  });
  if (!config || !activeElement) return null;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && open) {
      return;
    }
    onOpenChange(isOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip
        open={open}
        onOpenChange={handleOpenChange}
        delayDuration={0}
        disableHoverableContent
      >
        <TooltipTrigger asChild>
          <span
            className="pointer-events-none absolute"
            style={{
              position: "absolute",
              left: activeElement.getBoundingClientRect().left,
              top: activeElement.getBoundingClientRect().top,
              width: activeElement.offsetWidth,
              height: activeElement.offsetHeight,
              opacity: 0,
            }}
          />
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="flex flex-col gap-0 overflow-y-auto border border-solid border-neutral-700 bg-[var(--neutral-900)] p-4 w-auto max-w-[300px] focus:outline-none z-[10000]"
            sideOffset={10}
            data-id="feature-dialog/content"
            avoidCollisions
          >
            <div className="h-full flex flex-1 flex-col max-w-[200px]">
              <div
                className="flex-1 flex h-full flex-col overflow-y-auto"
                data-id="feature-dialog/container"
              >
                <div className="flex items-center justify-center">
                  <h2
                    className="text-lg text-neutral-100 font-semibold"
                    data-id="feature-dialog/title"
                  >
                    {config.title}
                  </h2>
                </div>
                <p
                  className="text-base text-neutral-100 mt-2 text-center"
                  data-id="feature-dialog/description"
                >
                  {config.description}
                </p>
              </div>
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};

import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

export interface WidgetBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const WidgetBody = forwardRef<HTMLDivElement, WidgetBodyProps>(
  ({ children, className, ...props }, ref) => {
    const { isMaximized } = usePanelMaximize();

    return (
      <div
        ref={ref}
        className={cn(
          "flex relative w-full flex-1 flex-col gap-4 overflow-hidden",
          isMaximized && "size-full overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

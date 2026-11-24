import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

export interface WidgetWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  testId?: string;
}

export const WidgetWrapper = forwardRef<HTMLDivElement, WidgetWrapperProps>(
  ({ children, className, testId, ...props }, ref) => {
    const { isMaximized } = usePanelMaximize();

    return (
      <div
        ref={ref}
        data-testid={testId}
        className={cn(
          "flex w-full flex-col gap-4 rounded-2xl md:border md:border-neutral-800 bg-neutral-950/60 md:p-4 group/widget md:h-full",
          isMaximized && "fixed inset-0 z-[60] bg-background p-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

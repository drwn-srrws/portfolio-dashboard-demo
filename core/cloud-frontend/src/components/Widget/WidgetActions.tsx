import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/utils";
import { useIsMobile } from "@/hooks/useMobile";

export interface WidgetActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const WidgetActions = forwardRef<HTMLDivElement, WidgetActionsProps>(
  ({ children, className, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center z-[4] gap-3 transition-all duration-300 ease-in-out flex-shrink-0",
          "opacity-100 visible",
          isMobile && "opacity-100 visible",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

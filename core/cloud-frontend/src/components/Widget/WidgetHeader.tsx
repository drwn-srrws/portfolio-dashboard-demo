import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/utils";

export interface WidgetHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const WidgetHeader = forwardRef<HTMLDivElement, WidgetHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-2 min-w-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

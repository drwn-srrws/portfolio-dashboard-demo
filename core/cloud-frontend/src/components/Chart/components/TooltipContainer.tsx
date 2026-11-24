import { HTMLAttributes } from "react";
import { cn } from "@/utils";

export type TooltipContainerProps = HTMLAttributes<HTMLDivElement>;

export const TooltipContainer = ({
  children,
  className,
  ...props
}: TooltipContainerProps) => (
  <div
    {...props}
    className={cn(
      "flex flex-col gap-1 rounded-lg border border-solid border-neutral-600 text-xs bg-neutral-800 p-2 m-2",
      className
    )}
  >
    {children}
  </div>
);

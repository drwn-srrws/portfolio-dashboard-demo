import { cn } from "@/utils";
import { HTMLAttributes } from "react";

export type TooltipTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const TooltipTitle = ({
  children,
  className,
  ...props
}: TooltipTitleProps) => (
  <h3 {...props} className={cn("text-sm", className)}>
    {children}
  </h3>
);

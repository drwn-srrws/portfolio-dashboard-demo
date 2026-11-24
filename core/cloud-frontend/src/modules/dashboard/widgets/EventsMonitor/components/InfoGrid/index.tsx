import { cn } from "@/utils";
import { ReactNode } from "react";

export interface InfoGridProps {
  className?: string;
  children?: ReactNode;
}

export const InfoGrid = ({ children, className }: InfoGridProps) => {
  return (
    <div
      className={cn(
        "space-y-1 text-xs md:space-y-0 md:text-sm md:grid md:grid-cols-4 md:gap-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface InfoGridCellProps {
  className?: string;
  children?: ReactNode;
}

export const InfoGridCell = ({ children, className }: InfoGridCellProps) => {
  return (
    <div className={cn("md:flex md:flex-col md:gap-1", className)}>
      {children}
    </div>
  );
};

export interface InfoGridCellLabelProps {
  className?: string;
  children?: ReactNode;
}

export const InfoGridCellLabel = ({
  children,
  className,
}: InfoGridCellLabelProps) => {
  return (
    <span
      className={cn(
        "text-neutral-400 md:text-neutral-300 md:uppercase md:text-sm",
        className
      )}
    >
      {children}:
    </span>
  );
};

export interface InfoGridCellValueProps {
  className?: string;
  children?: ReactNode;
}

export const InfoGridCellValue = ({
  children,
  className,
}: InfoGridCellValueProps) => {
  return (
    <span className={cn("md:font-bold md:text-base", className)}>
      {children}
    </span>
  );
};

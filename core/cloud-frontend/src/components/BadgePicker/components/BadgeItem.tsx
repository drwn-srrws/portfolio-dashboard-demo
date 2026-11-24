import { X } from "lucide-react";
import { MouseEvent } from "react";

import { cn } from "@/utils/utils";

import { Badge } from "@components/ui";
import { Button } from "@components/ui/button";

export interface DeletableBadgeProps {
  label: string;
  className?: string;
  testId?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onDelete?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const BadgeItem = ({
  label,
  className,
  testId,
  onClick,
  onDelete,
}: DeletableBadgeProps) => (
  <Badge
    variant="secondary"
    className={cn(
      "flex items-center gap-1 rounded-sm py-0 pr-1 bg-neutral-600",
      onClick ? "cursor-pointer" : "hover:bg-neutral-600",
      className
    )}
    onClick={onClick}
    data-testid={testId}
  >
    {label}
    <Button
      variant="ghost"
      className="size-6 rounded-full p-0"
      onClick={onDelete}
    >
      <X className="size-4" data-testid={`${testId}-delete-button`} />
    </Button>
  </Badge>
);

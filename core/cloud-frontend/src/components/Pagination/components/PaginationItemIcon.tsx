import { ReactNode } from "react";
import { Button } from "@components/ui";
import { PaginationItem as PaginationItemShadcn } from "@components/ui/pagination";

export interface PaginationItemIconProps {
  icon: ReactNode;
  page: number;
  i: number;
  onChange: (i: number) => void;
  testId?: string;
}

export const PaginationItemIcon = ({
  icon,
  page,
  i,
  testId,
  onChange,
}: PaginationItemIconProps) => (
  <PaginationItemShadcn key={i}>
    <Button
      data-testid={testId}
      variant="outline"
      size="icon"
      onClick={() => onChange(i)}
      disabled={page === i}
    >
      {icon}
    </Button>
  </PaginationItemShadcn>
);

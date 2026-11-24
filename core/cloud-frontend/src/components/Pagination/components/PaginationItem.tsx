import { Button } from "@components/ui";
import { PaginationItem as PaginationItemShadcn } from "@components/ui/pagination";

export interface PaginationItemProps {
  i: number;
  page: number;
  onChange: (i: number) => void;
}

export const PaginationItem = ({ i, page, onChange }: PaginationItemProps) => (
  <PaginationItemShadcn key={i}>
    <Button
      variant={i === page ? "default" : "outline"}
      size="icon"
      onClick={() => onChange(i)}
      disabled={page === i}
    >
      {i}
    </Button>
  </PaginationItemShadcn>
);

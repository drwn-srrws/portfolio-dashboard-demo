import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import {
  Pagination as ShadCNPagination,
  PaginationContent,
} from "@components/ui/pagination";
import { PageNumbers } from "./components/PageNumbers";
import { PaginationItemIcon } from "./components/PaginationItemIcon";

export interface PaginationProps {
  page: number;
  totalPages: number;
  maxPagesToShow?: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  maxPagesToShow = 3,
  onPageChange,
}: PaginationProps) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  return (
    <ShadCNPagination>
      <PaginationContent>
        <PaginationItemIcon
          icon={<ChevronFirst className="h-4 w-4" />}
          page={page}
          i={1}
          onChange={handleFirst}
        />
        <PaginationItemIcon
          icon={<ChevronLeft className="h-4 w-4" />}
          page={page}
          i={1}
          onChange={handlePrev}
        />
        <PageNumbers
          page={page}
          totalPages={totalPages}
          maxPagesToShow={maxPagesToShow}
          onChange={handlePageChange}
        />
        <PaginationItemIcon
          icon={<ChevronRight className="h-4 w-4" />}
          page={page}
          i={totalPages}
          onChange={handleNext}
          testId="coverage-universe-pagination-next"
        />
        <PaginationItemIcon
          icon={<ChevronLast className="h-4 w-4" />}
          page={page}
          i={totalPages}
          onChange={handleLast}
        />
      </PaginationContent>
    </ShadCNPagination>
  );
};

import { PaginationEllipsis } from "@/components/ui/pagination";

import { PaginationItem } from "./PaginationItem";

export interface PageNumbersProps {
  page: number;
  totalPages: number;
  maxPagesToShow: number;
  onChange: (page: number) => void;
}

export const PageNumbers = ({
  page,
  totalPages,
  maxPagesToShow,
  onChange,
}: PageNumbersProps) => {
  const pages = [];

  pages.push(<PaginationItem key={1} i={1} page={page} onChange={onChange} />);

  if (page > maxPagesToShow - 1) {
    pages.push(<PaginationEllipsis key="start" />);
  }

  let startPage = Math.max(2, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(2, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <PaginationItem key={i} i={i} page={page} onChange={onChange} />
    );
  }

  if (page < totalPages - maxPagesToShow + 2) {
    pages.push(<PaginationEllipsis key="end" />);
  }

  if (totalPages > 1) {
    pages.push(
      <PaginationItem
        key={totalPages}
        i={totalPages}
        page={page}
        onChange={onChange}
      />
    );
  }

  return pages;
};

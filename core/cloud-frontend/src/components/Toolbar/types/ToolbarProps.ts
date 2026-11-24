import { ReactNode } from "react";

export interface ToolbarProps {
  disableDateRange?: boolean;
  disableFilters?: boolean;
  topSlot?: ReactNode;
  bottomSlot?: ReactNode;
  filtersSlot?: ReactNode;
  dateRangeSlot?: ReactNode;
  primaryActionSlot?: ReactNode;
  secondaryActionSlot?: ReactNode;
}

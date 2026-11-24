import { dateRangeTabOptions } from "../constants/dateRangeTabOptions";
import { ToolbarProps } from "../types/ToolbarProps";
import { GlobalDateRange } from "./GlobalDateRange";
import { GlobalFilters } from "./GlobalFilters";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarContainer } from "./ToolbarContainer";
import { ToolbarHead } from "./ToolbarHead";
import { ToolbarWrapper } from "./ToolbarWrapper";

export const DesktopToolbar = ({
  disableDateRange,
  disableFilters,
  topSlot,
  bottomSlot,
  filtersSlot,
  dateRangeSlot,
  primaryActionSlot,
  secondaryActionSlot,
}: ToolbarProps) => {
  const filters = filtersSlot === undefined ? <GlobalFilters /> : filtersSlot;

  const dateRange =
    dateRangeSlot === undefined ? (
      <GlobalDateRange options={dateRangeTabOptions} />
    ) : (
      dateRangeSlot
    );

  return (
    <ToolbarWrapper>
      {topSlot}
      <ToolbarContainer>
        <ToolbarHead>{!disableFilters && filters}</ToolbarHead>
        <ToolbarActions>
          {primaryActionSlot}
          {!disableDateRange && dateRange}
          {secondaryActionSlot}
        </ToolbarActions>
      </ToolbarContainer>
      {bottomSlot}
    </ToolbarWrapper>
  );
};

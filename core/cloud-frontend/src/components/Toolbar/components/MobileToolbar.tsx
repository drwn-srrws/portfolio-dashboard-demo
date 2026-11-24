import { dateRangeTabOptions } from "../constants/dateRangeTabOptions";
import { ToolbarProps } from "../types/ToolbarProps";
import { GlobalDateRange } from "./GlobalDateRange";
import { GlobalFilters } from "./GlobalFilters";
import { Logo } from "./Logo";
import { ToggleSidebarButton } from "./ToggleSidebarButton";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarContainer } from "./ToolbarContainer";
import { ToolbarHead } from "./ToolbarHead";
import { ToolbarWrapper } from "./ToolbarWrapper";

export const MobileToolbar = ({
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
        <ToolbarHead>
          <ToggleSidebarButton />
          <Logo />
        </ToolbarHead>
        <ToolbarActions>
          {primaryActionSlot}
          {secondaryActionSlot}
        </ToolbarActions>
      </ToolbarContainer>
      {!disableDateRange && dateRange}
      {!disableFilters && filters}
      {bottomSlot}
    </ToolbarWrapper>
  );
};

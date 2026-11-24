import {
  BadgeMultiSelect,
  BadgeMultiSelectProps,
} from "@/components/BadgeMultiSelect";
import { Icon } from "@/components/Icon/Icon";

export type ColumnSelectProps = Omit<BadgeMultiSelectProps, "placeholder"> & {
  isMobile?: boolean;
};

export const ColumnSelect = ({
  isMobile = false,
  ...props
}: ColumnSelectProps) => {
  return (
    <BadgeMultiSelect
      {...props}
      disablePortal
      alwaysShowPlaceholder
      variant="triggerOnly"
      testId="portfolio-summary-metrics-select"
      placeholder={
        <Icon name="Columns3" color="#ffffff" size={isMobile ? "md" : "lg"} />
      }
    />
  );
};

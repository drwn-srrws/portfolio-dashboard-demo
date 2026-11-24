import { CompanyWorkflowStatus } from "@/api/types";
import { IconNameType } from "@/components/Icon/Icon";

export interface StatusConfig {
  icon: IconNameType;
  color: string;
  inactiveColor: string;
}

export const WORKFLOW_STATUS_CONFIG: Record<
  CompanyWorkflowStatus,
  StatusConfig
> = {
  [CompanyWorkflowStatus.Flagged]: {
    icon: "Bookmark",
    color: "text-red-500 fill-red-500",
    inactiveColor: "text-neutral-500",
  },
  [CompanyWorkflowStatus.Bottom_of_Funnel]: {
    icon: "Filter",
    color: "text-blue-500 fill-blue-500",
    inactiveColor: "text-neutral-500",
  },
};

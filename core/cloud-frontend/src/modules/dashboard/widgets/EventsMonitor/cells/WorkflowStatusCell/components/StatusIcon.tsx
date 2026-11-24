import React from "react";
import { Icon } from "@/components/Icon/Icon";
import { StatusConfig } from "../WorkflowStatusCell.config";

interface StatusIconProps {
  config: StatusConfig;
  isActive: boolean;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ config, isActive }) => (
  <Icon
    name={config.icon}
    size="lg"
    className={isActive ? config.color : config.inactiveColor}
  />
);

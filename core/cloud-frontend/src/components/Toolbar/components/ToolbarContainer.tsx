import { ReactNode } from "react";

export interface ToolbarContainerProps {
  children?: ReactNode;
}

export const ToolbarContainer = ({ children }: ToolbarContainerProps) => (
  <div className="flex items-center justify-between gap-4">{children}</div>
);

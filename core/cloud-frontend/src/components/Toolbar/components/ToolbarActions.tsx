import { ReactNode } from "react";

export interface ToolbarActionsProps {
  children?: ReactNode;
}

export const ToolbarActions = ({ children }: ToolbarActionsProps) => (
  <div className="flex items-center gap-2">{children}</div>
);

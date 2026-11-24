import { ReactNode } from "react";

export interface ToolbarHeadProps {
  children?: ReactNode;
}

export const ToolbarHead = ({ children }: ToolbarHeadProps) => (
  <div className="flex items-center gap-2">{children}</div>
);

import { ReactNode } from "react";

export interface ToolbarWrapperProps {
  children?: ReactNode;
}

export const ToolbarWrapper = ({ children }: ToolbarWrapperProps) => (
  <div className="flex flex-col bg-neutral-900 p-4 gap-4">{children}</div>
);

import { ReactNode } from "react";

export interface AdminWrapperProps {
  children: ReactNode;
}

export const AdminWrapper = ({ children }: AdminWrapperProps) => (
  <div className="flex h-screen flex-col items-center justify-center">
    <div className="flex w-full flex-col">{children}</div>
  </div>
);

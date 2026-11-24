import { ReactNode } from "react";

export interface SectionProps {
  children?: ReactNode;
}

export const Section = ({ children }: SectionProps) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export interface SectionTitleProps {
  children?: ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  return <span className="font-bold">{children}</span>;
};

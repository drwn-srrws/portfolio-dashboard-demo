import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui";

export interface SettingsAccordionProps {
  title: string;
  children: ReactNode;
  defaultValue?: string[];
  testId?: string;
}

export const SettingsAccordion = ({
  title,
  children,
  defaultValue,
  testId,
}: SettingsAccordionProps) => (
  <Accordion type="multiple" className="w-full" defaultValue={defaultValue}>
    <AccordionItem value={title}>
      <AccordionTrigger
        variant="secondary"
        className="text-base"
        data-testid={`${testId}-trigger`}
      >
        <div>{title}</div>
      </AccordionTrigger>
      <AccordionContent className="ml-6 mt-3 px-1">{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

import { cn } from "@/utils/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Icon } from "@/components/Icon/Icon";

const accordionTriggerVariants = cva(
  "flex flex-1 items-center py-2 text-sm font-medium transition-all hover:no-underline ",
  {
    variants: {
      variant: {
        default:
          "justify-between space-x-2 transition-transform [&[data-state=open]>svg]:rotate-180 ",
        secondary:
          "mr-4 transition-transform [&[data-state=open]>svg]:rotate-90 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-id="accordion/item"
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
    VariantProps<typeof accordionTriggerVariants>
>(({ className, variant, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-id="accordion/trigger"
      className={cn(
        accordionTriggerVariants({ variant, className }),
        "text-neutral-400 data-[state=open]:text-[var(--neutral-50)]"
      )}
      {...props}
    >
      {variant === "secondary" && (
        <Icon
          name="ChevronRight"
          color="white"
          size="lg"
          data-id="accordion/trigger/chevron"
          className="size-4 shrink-0 text-muted-foreground mr-2 bg-neutral-700 w-[16px] h-[16px] rounded-[2px] duration-200"
        />
      )}
      {children}
      {variant !== "secondary" && (
        <Icon
          name="ChevronDown"
          color="currentColor"
          size="lg"
          data-id="accordion/trigger/chevron"
          className="size-4 shrink-0  duration-200"
        />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-id="accordion/content"
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div
      className={cn("pb-4 pt-0", className)}
      data-id="accordion/content/inner"
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

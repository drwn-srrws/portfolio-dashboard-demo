import { useState } from "react";

import { Icon, IconNameType } from "@/components/Icon/Icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { BannerVariant } from "./types/BannerVariant";
import { BannerPlacement } from "./types/BannerPlacement";

const variants: Record<BannerVariant, string> = {
  [BannerVariant.success]: "p-4 text-lg text-white bg-green-600",
  [BannerVariant.info]: "p-4 text-lg text-white bg-blue-500",
  [BannerVariant.neutral]: "p-4 text-lg text-white bg-gray-500",
  [BannerVariant.warning]: "p-4 text-lg text-white bg-yellow-600",
  [BannerVariant.error]: "p-4 text-lg text-white bg-red-700",
};

const variantIcons: Record<BannerVariant, IconNameType> = {
  [BannerVariant.success]: "Check",
  [BannerVariant.info]: "Info",
  [BannerVariant.neutral]: "Info",
  [BannerVariant.warning]: "TriangleAlert",
  [BannerVariant.error]: "CircleAlert",
};

const variantIconColors: Record<BannerVariant, string> = {
  [BannerVariant.success]: "#ffffff",
  [BannerVariant.info]: "#ffffff",
  [BannerVariant.neutral]: "#ffffff",
  [BannerVariant.warning]: "#ffffff",
  [BannerVariant.error]: "#ffffff",
};

const placements = {
  top: "relative w-full",
  bottom: "fixed bottom-0 w-full",
};

export interface BannerProps {
  title: string;
  description: string;
  variant: BannerVariant;
  placement?: BannerPlacement;
}

export const Banner = ({
  title,
  description,
  variant,
  placement = BannerPlacement.top,
}: BannerProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  const iconName = variantIcons[variant];
  const iconColor = variantIconColors[variant];

  return (
    <div className={placements[placement]}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="w-full">
          <div
            className={variants[variant] + " flex w-full items-start gap-3"}
            role="alert"
          >
            <Icon
              name={iconName}
              color={iconColor}
              size="md"
              className="flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <div className="font-medium text-base mb-1">{title}</div>
              <div className="text-sm">{description}</div>
            </div>
            <CollapsibleTrigger
              asChild
              className="cursor-pointer flex-shrink-0"
            >
              <div onClick={handleDismiss}>
                <Icon name="X" color="currentColor" size="sm" />
              </div>
            </CollapsibleTrigger>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

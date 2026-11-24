import { icons } from "lucide-react";
import { forwardRef, JSX, Ref } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";

export type IconNameType = keyof typeof icons;

const iconSizeMap = {
  sm: 8,
  md: 10,
  lg: 12,
};

export interface IconProps {
  name: IconNameType;
  color?: string;
  size: "sm" | "md" | "lg" | number;
  className?: string;
}

export const Icon = ({ name, color, size, className, ...props }: IconProps) => {
  return (
    <ErrorBoundary
      fallback={() => {
        console.warn("Icon not found", name);

        return <div>Icon {name} not found</div>;
      }}
    >
      <IconContent
        name={name}
        color={color}
        size={size}
        className={className}
        {...props}
      />
    </ErrorBoundary>
  );
};

const IconContent = ({ name, color, size, className, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  const iconSize = typeof size === "number" ? size : iconSizeMap[size];

  return (
    <LucideIcon
      color={color}
      size={iconSize}
      className={className}
      {...props}
    />
  );
};

export const ForwardedIcon = forwardRef(
  (props: IconProps, ref: Ref<typeof Icon>) => {
    const LucideIcon = icons[
      props.name as keyof typeof icons
    ] as JSX.ElementType;

    return <LucideIcon {...props} ref={ref} />;
  }
);

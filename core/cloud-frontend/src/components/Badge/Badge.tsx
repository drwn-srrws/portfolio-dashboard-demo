import { Badge as ShadBadge } from "@components/ui/badge";

import { Icon, IconProps } from "../Icon/Icon";

export type CustomIcon = IconProps & { custom: true; size: "sm" | "md" | "lg" };
type BadgeSideElementProps = IconProps | CustomIcon;

const dotClasses = "absolute m-auto rounded-full bg-green-500";

const BadgeSideElementHandler = (props: BadgeSideElementProps) => {
  if ("custom" in props) {
    return (
      <div className="relative size-4">
        <div className={`${props.size} ${dotClasses}`} />
      </div>
    );
  }

  return <Icon {...props} />;
};

export interface BadgeProps {
  leftItem?: BadgeSideElementProps;
  rightItem?: BadgeSideElementProps;
  text: string;
  className?: {
    wrapper?: string;
    text?: string;
  };
}

export const Badge = ({ text, leftItem, rightItem, className }: BadgeProps) => (
  <ShadBadge variant="secondary" className={`pl-2 ${className?.wrapper}`}>
    <div className="flex items-center gap-1 p-px">
      {leftItem && <BadgeSideElementHandler {...leftItem} />}
      <p className={`max-w-24 truncate ${className?.text}`}>{text}</p>
      {rightItem && <BadgeSideElementHandler {...rightItem} />}
    </div>
  </ShadBadge>
);

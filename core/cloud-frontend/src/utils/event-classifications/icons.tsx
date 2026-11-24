import { Circle, Hexagon, Star, Triangle } from "lucide-react";

type HasPassed = { hasPassed: boolean };
const hasPassedColor = "lightgray";
const hasPassedBgColor = "bg-gray-300";
const orange = "#FFA500";
const orangeBg = "bg-[#FFA500]";
const iconSize = 12;
const triangleIconSize = 8;

export type EventClassificationIcon = React.FC<HasPassed>;

export const FilledHexagon = ({ hasPassed }: HasPassed) => (
  <div className="min-w-[10px]">
    <Hexagon
      size={iconSize}
      fill={hasPassed ? hasPassedColor : "red"}
      color={hasPassed ? hasPassedColor : "red"}
      strokeWidth={0}
    />
  </div>
);

export const FilledStar = ({ hasPassed }: HasPassed) => {
  const color = hasPassed ? hasPassedColor : "orange";

  return (
    <Star
      size={iconSize}
      color={color}
      fill={color}
      strokeWidth={0}
      className="absolute top-[5px] min-w-[10px]"
    />
  );
};

export const OutwardPointingTriangles = ({ hasPassed }: HasPassed) => {
  const color = hasPassed ? hasPassedColor : orange;

  return (
    <div className="relative ml-[3px] mt-[3px] size-4 min-w-[13px]">
      <Triangle
        size={triangleIconSize}
        color={color}
        fill={color}
        className="absolute top-[-2.5px]"
      />
      <Triangle
        size={triangleIconSize}
        color={color}
        fill={color}
        className="absolute top-[2.5px] rotate-180"
      />
    </div>
  );
};

export const FilledCircle = ({ hasPassed }: HasPassed) => {
  const color = hasPassed ? hasPassedColor : "orange";

  return (
    <div className="min-w-[13px]">
      <Circle size={iconSize} color={color} fill={color} />
    </div>
  );
};

export const CircledStar = ({ hasPassed }: HasPassed) => {
  const bgColor = hasPassed ? hasPassedBgColor : orangeBg;

  return (
    <div
      className={`rounded-full ${bgColor} mt-[1px] relative size-4 min-w-[13px]`}
    >
      <Star
        size={8}
        className="absolute left-[0.15rem] top-[1px]"
        fill="white"
        color="white"
      />
    </div>
  );
};

export const InwardPointingTriangles = ({ hasPassed }: HasPassed) => {
  const color = hasPassed ? hasPassedColor : "green";

  return (
    <div className="relative mt-0.5 min-w-[13px]">
      <Triangle
        size={triangleIconSize}
        color={color}
        fill={color}
        className="absolute top-[4px]"
      />
      <Triangle
        size={triangleIconSize}
        color={color}
        fill={color}
        className="absolute -top-px rotate-180"
      />
    </div>
  );
};

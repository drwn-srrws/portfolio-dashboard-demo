import { UserResponse } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { zIndices } from "@/utils";

export interface AvatarsProps {
  data: UserResponse[];
  maxVisibleAvatars?: number;
  disableTooltip?: boolean;
  testId?: string;
  dense?: boolean;
}
const zIndex = (index: number) => {
  const indexOfZIndices = zIndices.length - 2 - index;
  if (indexOfZIndices < 0) return zIndices[0];
  return zIndices[indexOfZIndices];
};

export const Avatars = ({
  data,
  maxVisibleAvatars,
  disableTooltip = false,
  testId,
  dense = true,
}: AvatarsProps) => {
  const visibleAvatars = maxVisibleAvatars
    ? data.slice(0, maxVisibleAvatars)
    : data;
  const extraCount =
    maxVisibleAvatars && data.length > maxVisibleAvatars
      ? data.length - maxVisibleAvatars
      : 0;

  return (
    <div
      className="flex items-center"
      data-testid={`${testId}-avatars-container`}
    >
      {visibleAvatars.map((user, index) => (
        <div
          className={`${index === 0 ? "" : "-ml-1"} ${zIndex(index)} size-6 rounded-full border-0 border-black`}
          key={user.email}
          data-testid={`${testId}-avatar-${user.first_name}`}
        >
          <Avatar disableTooltip={disableTooltip} data={user} dense={dense} />
        </div>
      ))}
      {extraCount > 0 && (
        <span
          className="ml-1 text-base text-neutral-400"
          key="avatar-overflow"
          data-testid={`${testId}-avatars-overflow-count`}
        >
          {`+${extraCount}`}
        </span>
      )}
    </div>
  );
};

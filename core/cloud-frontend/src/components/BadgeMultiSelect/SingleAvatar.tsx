import { UserResponse } from "@/api/types";
import { Avatar } from "@/components/Avatar";

export interface SingleAvatarProps {
  data: UserResponse;
}

export const SingleAvatar = ({ data }: SingleAvatarProps) => {
  return (
    <div className="flex items-center">
      <Avatar disableTooltip data={data} dense={true} />
    </div>
  );
};

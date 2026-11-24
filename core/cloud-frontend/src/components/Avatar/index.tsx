import { cond } from "ramda";

import { Tooltip } from "@components/Tooltip/Tooltip";
import {
  Avatar as ShadAvatar,
  AvatarFallback,
  AvatarImage,
} from "@components/ui/avatar";
import { first } from "@/utils/index";
import { cn } from "@/utils/utils";

const defaultColors = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-violet-500",
];

const whenFirstLetterIsBetween = (a: string, b: string) => (str: string) =>
  str[0].toLowerCase() >= a && str[0].toLowerCase() <= b;

const thenReturnColor = (index: number) => () =>
  defaultColors[index] || defaultColors[0];

const randomColorIfNoData = (name: string) => {
  if (!name) return defaultColors[0];

  return cond([
    [whenFirstLetterIsBetween("a", "d"), thenReturnColor(0)],
    [whenFirstLetterIsBetween("e", "h"), thenReturnColor(1)],
    [whenFirstLetterIsBetween("i", "l"), thenReturnColor(2)],
    [whenFirstLetterIsBetween("m", "p"), thenReturnColor(3)],
    [whenFirstLetterIsBetween("q", "t"), thenReturnColor(4)],
    [whenFirstLetterIsBetween("u", "z"), thenReturnColor(5)],
  ])(name);
};

type User = {
  first_name: string;
  last_name: string;
  email: string;
};

const getInitials = (user: User) =>
  (user?.first_name && (first(user?.first_name) as string)) +
  (user?.last_name && first(user?.last_name));

const NameTooltip = ({ user }: { user: User }) => (
  <p className="py-0.5 text-black">
    {user.first_name} {user.last_name}
  </p>
);

export interface AvatarProps {
  data: User;
  dense?: boolean;
  disableTooltip?: boolean;
  className?: string;
}

export const Avatar = ({
  data,
  dense,
  disableTooltip = false,
  className,
}: AvatarProps) => {
  const initials = getInitials(data);
  const color = randomColorIfNoData(data?.first_name || "");

  const size = dense ? "size-6" : "size-8";

  const avatarContent = (
    <ShadAvatar className={cn(`${size} block text-xs`, className)}>
      <AvatarImage
        src={data && !data.email.endsWith("@example.test") ? `/avatars/${data.email}.jpeg` : undefined}
        title={data ? data.first_name + " " + data.last_name : undefined}
        className="size-full"
      />
      <AvatarFallback delayMs={200}>
        <div
          className={`flex size-full items-center justify-center rounded-full text-white ${color} ${
            dense ? "-ml-px -mt-px" : ""
          }`}
        >
          <div className="w-full text-center">{initials}</div>
        </div>
      </AvatarFallback>
    </ShadAvatar>
  );

  return initials ? (
    disableTooltip ? (
      avatarContent
    ) : (
      <Tooltip
        asChild
        content={<NameTooltip user={data} />}
        trigger={avatarContent}
      />
    )
  ) : (
    <div></div>
  );
};

import { Avatars } from "@/components/Avatars";
import { Avatar } from "@/components/Avatar";

const parseAnalystString = (analystString: string) => {
  if (!analystString) return [];

  return analystString
    .split(",")
    .map((analyst, index) => {
      const parts = analyst.trim().split("|");
      return {
        id: index,
        email: parts[0] || "",
        first_name: parts[1] || "",
        last_name: parts[2] || "",
      };
    })
    .filter(
      (analyst) => analyst.email && analyst.first_name && analyst.last_name
    );
};

export interface AnalystAvatarRendererProps {
  analystString: string;
}

export const AnalystAvatarRenderer = ({
  analystString,
}: AnalystAvatarRendererProps) => {
  const users = parseAnalystString(analystString);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center justify-center size-full gap-2">
      {users.length === 1 ? (
        <Avatar data={users[0]} dense={false} />
      ) : (
        <Avatars data={users} dense={false} />
      )}
    </div>
  );
};

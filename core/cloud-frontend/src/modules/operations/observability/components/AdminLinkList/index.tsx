import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";
import type { AdminLink } from "@/config/types";

export interface AdminLinkListProps {
  links: AdminLink[];
}

export const AdminLinkList = ({ links }: AdminLinkListProps) => {
  return (
    <div className="flex flex-col">
      {links.map((link) => (
        <Button
          key={link.text}
          variant="ghost"
          className="flex w-full flex-row items-center justify-start gap-4"
          asChild
        >
          <a href={link.url} target="_blank">
            <Icon name={link.icon} color="currentColor" size="md" />
            {link.text}
          </a>
        </Button>
      ))}
    </div>
  );
};

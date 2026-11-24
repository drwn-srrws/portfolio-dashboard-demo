import { Card } from "@components/ui/card";
import type { AdminLinkCard as AdminLinkCardType } from "@/config/types";

import { AdminLinkList } from "../AdminLinkList";

export const AdminLinkCard = ({ title, groups }: AdminLinkCardType) => {
  return (
    <Card className="flex max-h-[80vh] w-96 flex-col gap-6 overflow-y-auto px-2 py-6">
      <h1 className="pl-2 text-base font-semibold uppercase text-white">
        {title}
      </h1>
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <h1 className="pl-2 text-sm uppercase text-neutral-500">
            {group.title}
          </h1>
          <AdminLinkList links={group.links} />
        </div>
      ))}
    </Card>
  );
};

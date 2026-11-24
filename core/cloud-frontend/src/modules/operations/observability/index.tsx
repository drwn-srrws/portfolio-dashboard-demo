import { useConfig } from "@/providers/ConfigProvider/useConfig";

import { AdminLinkCard } from "./components/AdminLinkCard";
import { AdminWrapper } from "./components/AdminWrapper";

export const ObservabilityPage = () => {
  const { admin } = useConfig();

  return (
    <AdminWrapper>
      <div className="mx-auto flex max-w-[96%] flex-wrap justify-center gap-4">
        {admin.cards.map((card) => (
          <AdminLinkCard
            key={card.title}
            title={card.title}
            groups={card.groups}
          />
        ))}
      </div>
    </AdminWrapper>
  );
};

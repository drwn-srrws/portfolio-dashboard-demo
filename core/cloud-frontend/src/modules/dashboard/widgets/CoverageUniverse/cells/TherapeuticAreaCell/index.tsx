import { useCallback, useState } from "react";

import { KgStatus } from "@/api/types/kgStatus";
import { useTrackEvent } from "@/modules/app-insights/hooks/useTrackEvent";
import { WeightedAttributeDistributionDropdown } from "../../components/WeightedAttributeDistributionDropdown";
import { WeightedAttributeItem } from "../../components/WeightedAttributeChip";

export interface TherapeuticAreaCellValue {
  companyId: number | null;
  items: WeightedAttributeItem[];
  kgStatus?: KgStatus | null;
}

interface TherapeuticAreaCellProps {
  value: TherapeuticAreaCellValue | null | undefined;
}

export const TherapeuticAreaCell = ({ value }: TherapeuticAreaCellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const trackTherapeuticAreaExpanded = useTrackEvent(
    "KGTherapeuticAreaExpanded"
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);

      if (!open || value?.companyId == null) return;

      trackTherapeuticAreaExpanded({
        companyId: value.companyId,
        therapeuticAreaCount: value.items.length,
      });
    },
    [trackTherapeuticAreaExpanded, value]
  );

  if (!value) return null;

  const { items } = value;

  if (items.length === 0) {
    const hasKgData =
      value.kgStatus === KgStatus.FRESH || value.kgStatus === KgStatus.STALE;

    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-sm text-neutral-500 italic">
          {hasKgData ? "No Revenue Attribution details" : "No KG data"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center">
      <WeightedAttributeDistributionDropdown
        items={items}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
};

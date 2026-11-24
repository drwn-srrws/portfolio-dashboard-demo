import { cn } from "@/utils/utils";
import { Tooltip } from "@components/Tooltip/Tooltip";

export type IMetricCard = {
  name: string;
  displayName: string;
  value: React.ReactNode;
  status: string;
  description?: string;
};

export interface MetricCardProps extends IMetricCard {
  isDynamicFontColoringEnabled: boolean;
}

const styles: Record<string, { [key: string]: string }> = {
  positive: {
    wrapper: "text-green-100",
  },
  negative: {
    wrapper: "text-red-100",
  },
  neutral: {
    wrapper: "",
  },
};

export const MetricCard = ({
  displayName,
  value,
  status,
  description,
  isDynamicFontColoringEnabled,
}: MetricCardProps) => {
  const cardContent = (
    <div
      className={cn(
        "flex border w-auto rounded-md p-4 md:py-1 md:px-4 gap-2 items-center justify-between min-w-[180px] border-neutral-800",
        isDynamicFontColoringEnabled ? styles[status].wrapper : ""
      )}
    >
      <h6 className="text-base font-medium leading-5 md:leading-7  text-neutral-400 whitespace-nowrap">
        {displayName}
      </h6>
      <div className="flex items-center gap-3">
        <h3
          className={cn(
            "text-base font-medium leading-5 md:leading-7 whitespace-nowrap"
          )}
        >
          {value}
        </h3>
      </div>
    </div>
  );

  return description ? (
    <Tooltip
      trigger={cardContent}
      content={description}
      triggerClasses="w-full"
      contentClasses="bg-neutral-800 text-white p-2 rounded max-w-[20rem] break-words border border-neutral-600 shadow-md"
      side="top"
    />
  ) : (
    cardContent
  );
};

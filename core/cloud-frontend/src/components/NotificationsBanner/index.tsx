import { useMemo } from "react";
import { Banner } from "@/components/Banner";
import { BannerVariant } from "@/components/Banner/types/BannerVariant";
import { BannerPlacement } from "@/components/Banner/types/BannerPlacement";
import { useGetActiveAlerts } from "@/api/endpoints/notifications/notifications";

const severityToVariant: Record<string, BannerVariant> = {
  success: BannerVariant.success,
  info: BannerVariant.info,
  neutral: BannerVariant.neutral,
  warning: BannerVariant.warning,
  error: BannerVariant.error,
};

export const NotificationsBanner = () => {
  const { data } = useGetActiveAlerts();
  const alerts = useMemo(() => data?.alerts ?? [], [data]);
  const activeAlerts = alerts.filter((alert) => alert.active);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="relative z-30 w-full">
      {activeAlerts.map((alert) => {
        const variant = severityToVariant[alert.severity] ?? BannerVariant.info;

        return (
          <Banner
            key={alert.id}
            title={alert.title}
            description={alert.description}
            variant={variant}
            placement={BannerPlacement.top}
          />
        );
      })}
    </div>
  );
};

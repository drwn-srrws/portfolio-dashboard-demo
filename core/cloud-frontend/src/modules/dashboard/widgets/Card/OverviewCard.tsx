import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { formatNumber } from "@/utils/number";
import { formatMetric } from "@/utils/metrics";
import { MetricDisplayType } from "@api/types";
import { useCompanyPageData } from "@/hooks/api/useCompanyPageData";

import { Skeleton } from "@/components/ui/skeleton";
import { dollarsToUnit, numToDollar } from "@/utils";
import { Tooltip } from "@components/Tooltip/Tooltip";
import { useCompanyPriceTargets } from "@/providers/CompanyPriceTargetsProvider/useCompanyPriceTargets";
import Card from "./Card";

const OverviewCard = () => {
  const params = useParams();
  const { companyId } = params;

  const { companyData, isLoading } = useCompanyPageData(Number(companyId));
  // @ts-expect-error - remove this when schema is updated
  const subsector = companyData?.subsector;
  const lead_analyst = companyData?.primary_analyst;
  const secondary_analysts = companyData?.secondary_analysts;
  const upside_price_target = companyData?.primary_analyst_upside_price_target;
  const downside_price_target =
    companyData?.primary_analyst_downside_price_target;
  const risk_reward = companyData?.risk_reward;
  const volume = companyData?.volume_bbg;
  const market_cap = companyData?.market_cap_bbg;
  const position_ytd_pnl = companyData?.position_ytd_pnl_by_funds;

  const { setCompanyId } = useCompanyPriceTargets();
  const leadAnalyst = lead_analyst
    ? `${lead_analyst?.first_name} ${lead_analyst?.last_name}`
    : "-";

  const secondaryAnalysts = secondary_analysts
    ? secondary_analysts
        ?.map((analyst) => `${analyst.first_name} ${analyst.last_name}`)
        .join(", ")
    : "-";

  const upsidePt = numToDollar(Number(upside_price_target?.price_target_usd));

  const downsidePt = numToDollar(
    Number(downside_price_target?.price_target_usd)
  );

  const riskReward = risk_reward?.toFixed(2);

  const volumeFormatted = formatNumber(Number(volume));

  const marketCap = numToDollar(dollarsToUnit(Number(market_cap), 9));

  const ytdPnl = useMemo(() => {
    const allFundsEntry = position_ytd_pnl?.find(
      (entry) => entry.fund?.name === "All" || entry.fund?.id === 0
    );

    return numToDollar(Number(allFundsEntry?.ytd_pnl));
  }, [position_ytd_pnl]);

  const ytdPnlPercentNav = useMemo(() => {
    const allFundsEntry = position_ytd_pnl?.find(
      (entry) => entry.fund?.name === "All" || entry.fund?.id === 0
    );

    return formatMetric(
      allFundsEntry?.ytd_pnl_percent_nav,
      MetricDisplayType.percent
    );
  }, [position_ytd_pnl]);

  return (
    <Card title="Overview">
      {isLoading ? (
        <Skeleton className="size-full" />
      ) : (
        <div className="grid grid-cols-2 gap-x-8">
          <DataRow label="Lead Analyst" value={leadAnalyst} />
          <DataRow label="Secondary Analyst(s)" value={secondaryAnalysts} />

          <DataRow label="Subsector" value={subsector?.name} />
          <Tooltip
            trigger={<DataRow label="Risk / Reward" value={riskReward} />}
            content={
              risk_reward && <RiskRewardHover riskRewardValue={risk_reward} />
            }
            triggerClasses="w-full cursor-default"
            side="right"
          />
          <DataRow
            label="Upside PT"
            value={upsidePt}
            onClick={() => setCompanyId(Number(companyId))}
          />
          <DataRow
            label="Downside PT"
            value={downsidePt}
            onClick={() => setCompanyId(Number(companyId))}
          />
          <DataRow label="Volume" value={volumeFormatted} />
          <DataRow label="Market Cap ($B)" value={marketCap} />
          <DataRow label="YTD PnL (% NAV)" value={ytdPnlPercentNav} />
          <DataRow label="YTD PnL" value={ytdPnl} />
        </div>
      )}
    </Card>
  );
};

const DataRow = ({
  label,
  value,
  withBottomBorder = true,
  onClick,
}: {
  label: string;
  value?: string | number;
  withBottomBorder?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`flex justify-between w-full py-2 ${
      withBottomBorder && "border-b border-neutral-800"
    } ${onClick && "cursor-pointer"}`}
    onClick={onClick}
  >
    <span className="text-base text-neutral-400">{label}</span>
    <span className="text-base">{value || "N/A"}</span>
  </div>
);

const RiskRewardHover = ({ riskRewardValue }: { riskRewardValue: number }) => (
  <div className="flex justify-between space-x-4 text-xs text-black">
    <div>
      <div className="mb-1 font-semibold">Risk / Reward Ratio</div>
      <div>{riskRewardValue.toFixed(2)}</div>
    </div>
  </div>
);

export default OverviewCard;

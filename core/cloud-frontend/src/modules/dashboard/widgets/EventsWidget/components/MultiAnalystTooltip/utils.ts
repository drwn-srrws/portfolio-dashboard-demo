import { MetricResultDataAnyOfItem } from "@api/types/index";

export type EstimateItem = {
  event_estimate_id: number;
  is_primary_analyst: boolean;
  analyst_avatar: string;
  event_estimate_upside_price_move_percent?: number | null;
  event_estimate_downside_price_move_percent?: number | null;
  event_estimate_upside_nav_impact?: number | null;
  event_estimate_downside_nav_impact?: number | null;
  event_estimate_up_down_ratio?: string | null;
  event_estimate_upside_probability?: string | null;
  event_estimate_last_updated_date?: string | null;
};

export const parseAnalystAvatar = (avatar: string) => {
  const [email = "", first_name = "", last_name = ""] = avatar.split("|");
  return { email, first_name, last_name };
};

export const getAllEstimates = (
  data: MetricResultDataAnyOfItem
): EstimateItem[] => {
  return (data.all_estimates as EstimateItem[] | undefined) ?? [];
};

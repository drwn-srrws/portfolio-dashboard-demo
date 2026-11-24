import { AnalystBreakdownStats } from "@/api/types/analystBreakdownStats";

export interface AnalystBreakdownRow extends Record<string, unknown> {
  id: string;
  analyst: string;
  analyst_avatar: string;
}

export const buildRows = (
  data: AnalystBreakdownStats[]
): AnalystBreakdownRow[] => {
  return data.map((item) => ({
    ...item,
    id: String(item.analyst ?? ""),
    analyst: String(item.analyst ?? ""),
    analyst_avatar: String(item.analyst_avatar ?? ""),
  }));
};

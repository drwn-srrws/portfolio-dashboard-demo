import { TreemapNode } from "../components/Treemap";
import { GroupStats, BoxType, SizeMetric } from "../types";

interface GroupStatItem {
  "subsector.name"?: string;
  region?: string;
  country?: string;
  number_of_companies: number;
  market_cap: number;
}

const getItemName = (item: GroupStatItem, boxType: BoxType): string => {
  switch (boxType) {
    case "sector":
      return item["subsector.name"] || "";
    case "region":
      return item.region || "";
    case "country":
      return item.country || "";
    default:
      return "";
  }
};

export const mapGroupStatsToTreemapData = (
  groupStats: GroupStats,
  boxType: BoxType,
  sizeMetric: SizeMetric
): TreemapNode[] => {
  if (boxType === "company") {
    return [];
  }

  const data = groupStats[boxType];

  return data
    .filter((item) => {
      const name = getItemName(item, boxType);
      return name && item[sizeMetric] > 0;
    })
    .map((item, index) => ({
      id: `${boxType}-${index}`,
      name: getItemName(item, boxType) || "Unknown",
      value: item[sizeMetric] || 0,
    }))
    .sort((a, b) => b.value - a.value);
};

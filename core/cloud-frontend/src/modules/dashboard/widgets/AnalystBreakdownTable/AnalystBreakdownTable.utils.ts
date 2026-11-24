import { MetricResult } from "@api/types/index";

export interface AnalystData {
  id: string;
  analystName: string;
  analystAvatar: string;
  primaryExposure: number;
  primaryPnLPct: number;
  secondaryExposure: number;
  secondaryPnLPct: number;
  [key: string]: string | number;
}

export const transformAnalystData = (data?: MetricResult[]): AnalystData[] => {
  if (!data) return [];

  const numBenchmarks = data.length / 2;
  const primaryData = data[0]?.data || [];
  const secondaryData = data[numBenchmarks]?.data || [];

  const primaryAlphaPnlPercentMaps = Array.from(
    { length: numBenchmarks },
    (_, i) => {
      return (data[i]?.data?.reduce((map: Record<string, number>, item) => {
        const id = item?.primary_analyst as string;
        map[id] = Number(item?.cumulative_alpha_pnl_percent) || 0;
        return map;
      }, {}) || {}) as Record<string, number>;
    }
  );

  const secondaryAlphaPnlPercentMaps = Array.from(
    { length: numBenchmarks },
    (_, i) => {
      return (data[i + numBenchmarks]?.data?.reduce(
        (map: Record<string, number>, item) => {
          const id = item?.secondary_analyst as string;
          map[id] = Number(item?.cumulative_alpha_pnl_percent) || 0;
          return map;
        },
        {}
      ) || {}) as Record<string, number>;
    }
  );

  const primaryDataMap = primaryData.reduce<Record<string, AnalystData>>(
    (map, item) => {
      const name = String(item.primary_analyst) || null;
      const avatar = String(item.primary_analyst_avatar) || null;

      if (!name || !avatar) return map;

      const analystData: AnalystData = {
        id: name,
        analystName: name,
        analystAvatar: avatar,
        primaryExposure: Number(item.net_exposure) || 0,
        primaryPnLPct: Number(item.cumulative_pnl_percent_nav) || 0,
        secondaryExposure: 0,
        secondaryPnLPct: 0,
      };

      primaryAlphaPnlPercentMaps.forEach((benchmarkMap, index) => {
        analystData[`primaryBenchmark${index}AlphaPnlPercent`] =
          benchmarkMap[name] || 0;
      });

      secondaryAlphaPnlPercentMaps.forEach((_, index) => {
        analystData[`secondaryBenchmark${index}AlphaPnlPercent`] = 0;
      });

      map[name] = analystData;
      return map;
    },
    {}
  );

  const mergedDataMap = secondaryData.reduce<Record<string, AnalystData>>(
    (map, item) => {
      const name = String(item.secondary_analyst);
      const firstName = name.split(" ")[0];
      const lastName = name.split(" ").slice(1).join(" ");
      const avatar = `|${firstName}|${lastName}`;

      if (!name || !avatar) return map;

      if (map[name]) {
        map[name].secondaryExposure = Number(item.net_exposure) || 0;
        map[name].secondaryPnLPct =
          Number(item.cumulative_pnl_percent_nav) || 0;

        secondaryAlphaPnlPercentMaps.forEach((benchmarkMap, index) => {
          map[name][`secondaryBenchmark${index}AlphaPnlPercent`] =
            benchmarkMap[name] || 0;
        });
      } else {
        const analystData: AnalystData = {
          id: name,
          analystName: name,
          analystAvatar: avatar,
          primaryExposure: 0,
          primaryPnLPct: 0,
          secondaryExposure: Number(item.net_exposure) || 0,
          secondaryPnLPct: Number(item.cumulative_pnl_percent_nav) || 0,
        };

        primaryAlphaPnlPercentMaps.forEach((_, index) => {
          analystData[`primaryBenchmark${index}AlphaPnlPercent`] = 0;
        });

        secondaryAlphaPnlPercentMaps.forEach((benchmarkMap, index) => {
          analystData[`secondaryBenchmark${index}AlphaPnlPercent`] =
            benchmarkMap[name] || 0;
        });

        map[name] = analystData;
      }

      return map;
    },
    primaryDataMap
  );

  return Object.values(mergedDataMap);
};

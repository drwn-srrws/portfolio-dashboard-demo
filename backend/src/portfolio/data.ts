export const NAV = new Map([
  ["Northstar Capital", 16_000_000],
  ["Harbor Ridge Partners", 12_000_000],
]);

const instruments = [
  ["ISRG", "Medical Technology", "Avery Chen", "Large Cap", "Device", "Surgery", "Marketed", "US"],
  ["DXCM", "Medical Technology", "Avery Chen", "Mid Cap", "Device", "Endocrinology", "Marketed", "US"],
  ["ALNY", "Therapeutics", "Jordan Reed", "Large Cap", "RNA", "Rare Disease", "Marketed", "US"],
  ["BNTX", "Therapeutics", "Jordan Reed", "Mid Cap", "RNA", "Oncology", "Phase III", "Europe"],
  ["CRSP", "Therapeutics", "Sam Taylor", "Small Cap", "Gene Editing", "Rare Disease", "Phase II", "Europe"],
  ["PODD", "Medical Technology", "Sam Taylor", "Mid Cap", "Device", "Endocrinology", "Marketed", "US"],
];

export const dayMs = 86_400_000;
const ordinal = (date: Date) => date.getTime() / dayMs + 719163;

export function holdings(date: Date) {
  return [...NAV].flatMap(([fund, nav], fundIndex) =>
    instruments.map(([ticker, sector, analyst, cap, modality, ta, stage, geography], index) => {
      const direction = (index + fundIndex * 2) % 4 === 1 ? "Short" : "Long";
      const exposure = (direction === "Long" ? 1 : -1) * nav * (0.012 + 0.006 * index + 0.005 * fundIndex);
      return {
        fund_name: fund, company_subsector: sector, primary_analyst: analyst,
        secondary_analyst: instruments[(index + 2) % instruments.length][2],
        direction, company_netted_direction: direction,
        company_security_code_portfolio_asset_class: ticker,
        instrument_security_code: ticker, position_instrument_security_code: ticker,
        instrument_portfolio_asset_class: "Equity", market_cap: cap, modality, ta, stage, geography,
        days_to_cover_binned: ["<1", "1-3", "3-5"][index % 3],
        illiquid_private: false, whale_minnow_tag: index < 2 ? "Minnow" : "Whale",
        exposure: exposure * (1 + 0.1 * Math.sin(ordinal(date) / 21 + index)),
        seed: index + 1 + fundIndex * 3,
      };
    }),
  );
}

export type Holding = ReturnType<typeof holdings>[number];

export function dailyPnl(row: Holding, date: Date) {
  const day = ordinal(date);
  const wave = Math.sin(day / 9 + row.seed) + 0.5 * Math.sin(day / 3);
  return Math.abs(row.exposure) * (0.0025 * wave + (row.seed % 3 ? 0.001 : -0.0014));
}

export const benchmarkReturn = (date: Date) => 0.0002 + 0.001 * Math.sin(ordinal(date) / 7);

export function analystAvatar(name: string) {
  const [first, last] = name.split(" ");
  return `${first.toLowerCase()}@example.test|${first}|${last}`;
}

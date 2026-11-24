import type { Config } from "../types";

export const navItems: Config["navItems"] = [
  {
    text: "Portfolio Analytics",
    icon: "ChartPie",
    children: [
      {
        text: "Position Exposure",
        url: "/portfolio/position-exposure",
        icon: "ChartPie",
        metadata: { title: "Position Exposure" },
      },
      {
        text: "Position Differences",
        url: "/portfolio/position-differences",
        icon: "ChartBar",
        metadata: { title: "Position Differences" },
      },
      {
        text: "Performance Summary",
        url: "/portfolio/performance-summary",
        icon: "ChartLine",
        metadata: { title: "Performance Summary" },
      },
    ],
  },
];

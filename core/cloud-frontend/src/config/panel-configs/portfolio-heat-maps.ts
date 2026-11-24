import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioHeatMapsPagePanelConfig: Config["portfolioHeatMapsPagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        orientation: Orientation.VERTICAL,
        data: [
          {
            type: "leaf",
            data: {
              views: ["panel_1"],
              activeView: "panel_1",
              id: "1",
              locked: true,
              hideHeader: true,
            },
            size: 100,
          },
        ],
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        contentComponent: "PerformanceDistribution",
        tabComponent: "props.defaultTabComponent",
        params: {
          setDateRangeSettings: {
            type: "WTD",
          },
          displayMetrics: [
            "cumulative_pnl_percent_nav",
            "net_exposure_percent",
          ],
          groupByMetrics: [
            "company_netted_direction",
            "fund_name",
            "company_subsector",
            "instrument_portfolio_asset_class",
            "illiquid_private",
          ],
          defaultGroupByMetric: "company_netted_direction",
          defaultDisplayMetric: "cumulative_pnl_percent_nav",
          defaultSubgroupBy: "company_security_code_portfolio_asset_class",
          defaultSizeMetric: "net_exposure_percent",
        },
        title: "WTD Performance Distribution",
      },
    },
    activeGroup: "1",
  };

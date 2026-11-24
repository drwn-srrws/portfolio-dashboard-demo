import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioPositionExposureOptimizedPagePanelConfig: Config["portfolioPositionExposureOptimizedPagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        orientation: Orientation.HORIZONTAL,
        data: [
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_4"],
                  activeView: "panel_4",
                  id: "4",
                  locked: true,
                  hideHeader: true,
                },
                size: 260,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_1"],
                  activeView: "panel_1",
                  id: "1",
                  locked: true,
                  hideHeader: true,
                },
                size: 270,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_6"],
                  activeView: "panel_6",
                  id: "6",
                  locked: true,
                  hideHeader: true,
                },
                size: 190,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_9"],
                  activeView: "panel_9",
                  id: "9",
                  locked: true,
                  hideHeader: true,
                },
                size: 280,
              },
            ],
            size: 500,
          },
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_5"],
                  activeView: "panel_5",
                  id: "5",
                  locked: true,
                  hideHeader: true,
                },
                size: 260,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_2"],
                  activeView: "panel_2",
                  id: "2",
                  locked: true,
                  hideHeader: true,
                },
                size: 270,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_7"],
                  activeView: "panel_7",
                  id: "7",
                  locked: true,
                  hideHeader: true,
                },
                size: 470,
              },
            ],
            size: 480,
          },
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_3"],
                  activeView: "panel_3",
                  id: "3",
                  locked: true,
                  hideHeader: true,
                },
                size: 660,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_8"],
                  activeView: "panel_8",
                  id: "8",
                  locked: true,
                  hideHeader: true,
                },
                size: 340,
              },
            ],
            size: 700,
          },
        ],
      },
      width: 2000,
      height: 1000,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_4: {
        id: "panel_4",
        contentComponent: "FundSummaryOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Fund Summary",
      },
      panel_1: {
        id: "panel_1",
        contentComponent: "MarketCapDistributionOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Market Cap Distribution",
      },
      panel_5: {
        id: "panel_5",
        contentComponent: "FundBreakdownOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Fund Breakdown",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "LiquiditySummaryOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Liquidity Summary",
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "AnalystBreakdownOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Analyst Breakdown",
      },
      panel_6: {
        id: "panel_6",
        contentComponent: "KgModalityDistributionOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Modality Distribution",
      },
      panel_7: {
        id: "panel_7",
        contentComponent: "KgTaDistributionOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Therapeutic Area Distribution",
      },
      panel_8: {
        id: "panel_8",
        contentComponent: "KgStageDistributionOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Development Stage Distribution",
      },
      panel_9: {
        id: "panel_9",
        contentComponent: "KgGeographyDistributionOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Geography Distribution",
      },
    },
    activeGroup: "4",
  };

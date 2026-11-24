import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const platformHomepagePanelConfig: Config["platformHomepagePanelConfig"] =
  {
    grid: {
      root: {
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
            size: 41,
          },
          {
            type: "branch",
            data: [
              {
                type: "leaf",
                data: {
                  views: ["panel_3"],
                  activeView: "panel_3",
                  id: "1",
                  locked: true,
                  hideHeader: true,
                },
                size: 375,
              },
              {
                type: "leaf",
                data: {
                  views: ["panel_1"],
                  activeView: "panel_1",
                  id: "3",
                  locked: true,
                  hideHeader: true,
                },
                size: 375,
              },
            ],
            size: 636,
            orientation: Orientation.HORIZONTAL,
          },
        ],
        size: 1055,
        orientation: Orientation.VERTICAL,
      },
      width: 1055,
      height: 685,
      orientation: Orientation.VERTICAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        title: "Winners & Losers (Stock Price)",
        contentComponent: "CoverageMonitorWinnersAndLosers",
        tabComponent: "props.defaultTabComponent",
        params: {
          groupByTop: ["5", "10"],
          sortByMetric: "ytd_percent_return_bbg",
        },
      },
      panel_3: {
        id: "panel_3",
        contentComponent: "UpcomingEvents",
        tabComponent: "props.defaultTabComponent",
        title: "Upcoming Events",
      },
      panel_4: {
        id: "panel_4",
        contentComponent: "TradingTickerCards",
        tabComponent: "props.defaultTabComponent",
        title: "Metric Cards",
        minimumHeight: 70,
        maximumHeight: 70,
        params: {},
      },
    },
    activeGroup: "1",
  };

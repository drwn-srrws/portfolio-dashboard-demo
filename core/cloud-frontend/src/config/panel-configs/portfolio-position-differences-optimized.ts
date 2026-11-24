import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioPositionDifferencesOptimizedPagePanelConfig: Config["portfolioPositionDifferencesOptimizedPagePanelConfig"] =
  {
    grid: {
      root: {
        type: "branch",
        orientation: Orientation.HORIZONTAL,
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
            size: 50,
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
            size: 50,
          },
        ],
      },
      width: 1934.328125,
      height: 1155.5,
      orientation: Orientation.HORIZONTAL,
    },
    panels: {
      panel_1: {
        id: "panel_1",
        contentComponent: "PositionDifferencesTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultCombinationIndex: 0,
        },
        title: "Northstar v Harbor",
      },
      panel_2: {
        id: "panel_2",
        contentComponent: "PositionDifferencesTable",
        tabComponent: "props.defaultTabComponent",
        params: {
          defaultCombinationIndex: 1,
        },
        title: "Harbor v Northstar",
      },
    },
    activeGroup: "1",
  };

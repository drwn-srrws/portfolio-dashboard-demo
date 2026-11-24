import { Orientation } from "dockview-react";
import type { Config } from "../types";

export const portfolioBasketBreakdownOptimizedPagePanelConfig: Config["portfolioBasketBreakdownOptimizedPagePanelConfig"] =
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
        contentComponent: "BasketBreakdownOptimized",
        tabComponent: "props.defaultTabComponent",
        params: {},
        title: "Basket Breakdown",
      },
    },
    activeGroup: "1",
  };

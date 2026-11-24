import { Orientation, SerializedDockview } from "dockview-react";
import { Companies } from "./components";

export const components = {
  Companies,
};

export const config: SerializedDockview = {
  grid: {
    root: {
      type: "branch",
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
          size: 1,
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
      contentComponent: "Companies",
      tabComponent: "props.defaultTabComponent",
      title: "Companies",
    },
  },
  activeGroup: "2",
};

import {
  SerializedDockview,
  Orientation,
  GroupPanelViewState,
} from "dockview-react";

interface BranchNodeWithOrientation {
  type: "branch";
  data: GridObjectWithOrientation[];
  size?: number;
  visible?: boolean;
  orientation?: Orientation;
}

interface LeafNode {
  type: "leaf";
  data: GroupPanelViewState;
  size?: number;
  visible?: boolean;
}

type GridObjectWithOrientation = LeafNode | BranchNodeWithOrientation;

export type PanelConfig = Omit<SerializedDockview, "grid"> & {
  grid: Omit<SerializedDockview["grid"], "root"> & {
    root: GridObjectWithOrientation;
  };
};

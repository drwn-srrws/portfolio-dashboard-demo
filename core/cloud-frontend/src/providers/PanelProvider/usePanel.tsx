import { useContext } from "react";
import { PanelContext } from "./PanelContext";

export const usePanel = () => useContext(PanelContext);

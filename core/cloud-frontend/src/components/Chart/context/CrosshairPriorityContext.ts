import { createContext, RefObject, useContext } from "react";
import { ISeriesRef } from "../typings/ISeriesRef";

export interface ICrosshairPriorityContext {
  prioritySeriesRefs: RefObject<ISeriesRef[]>;
  registerPriority: (ref: ISeriesRef) => void;
  unregisterPriority: (ref: ISeriesRef) => void;
}

export const CrosshairPriorityContext =
  createContext<ICrosshairPriorityContext | null>(null);

export const useCrosshairPriorityContext = () =>
  useContext(CrosshairPriorityContext);

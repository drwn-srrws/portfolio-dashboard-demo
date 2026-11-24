import { IPriceScaleApi } from "lightweight-charts";

export interface IPriceScaleRef {
  api: IPriceScaleApi | null;
  create: (this: IPriceScaleRef, id: string) => void;
  dispose: (this: IPriceScaleRef) => void;
}

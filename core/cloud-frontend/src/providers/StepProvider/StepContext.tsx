import { createContext } from "react";

export type IStep = number;

export interface IStepContext {
  step: IStep;
  setStep: (step: IStep) => void;
}

export const StepContext = createContext<IStepContext>({
  step: 0,
  setStep: () => {},
});

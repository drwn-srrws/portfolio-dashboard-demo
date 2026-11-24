import { ReactNode, useMemo, useState } from "react";
import { IStep, StepContext } from "./StepContext";

export interface IStepProviderProps {
  children: ReactNode;
}

export const StepProvider = ({ children }: IStepProviderProps) => {
  const [step, setStep] = useState<IStep>(0);

  const contextValue = useMemo(() => ({ step, setStep }), [step, setStep]);

  return (
    <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>
  );
};

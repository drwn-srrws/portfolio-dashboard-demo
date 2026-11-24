import { useStep } from "@/providers/StepProvider";
import { useCallback } from "react";

const useStepper = () => {
  const { step, setStep } = useStep();

  const forward = useCallback(() => {
    setStep(step + 1);
  }, [step, setStep]);

  const backward = useCallback(() => {
    setStep(step - 1);
  }, [step, setStep]);

  const reset = useCallback(() => {
    setStep(0);
  }, [setStep]);

  return { step, forward, backward, reset };
};

export default useStepper;

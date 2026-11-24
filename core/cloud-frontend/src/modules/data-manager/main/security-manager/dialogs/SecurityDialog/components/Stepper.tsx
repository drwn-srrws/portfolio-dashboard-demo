import useStepper from "@/hooks/useStepper";
import { IssuerStep } from "./IssuerStep";
import { useMemo } from "react";
import { SecurityStep } from "./SecurityStep";
import { StepperDisplay } from "./StepperDisplay";
import { Icon } from "@/components/Icon/Icon";
import { Close } from "@radix-ui/react-dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STEP_COMPONENTS = {
  [0]: IssuerStep,
  [1]: SecurityStep,
} as const;

const steps = [{ label: "Select Issuer" }, { label: "Configure Security" }];

const Stepper = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  const { step, forward, backward } = useStepper();

  const StepComponent = useMemo(() => {
    if (step === undefined) {
      return null;
    }
    return STEP_COMPONENTS[step as keyof typeof STEP_COMPONENTS];
  }, [step]);

  const onClose = () => {
    onOpenChange(false);
  };

  const className = useMemo(() => {
    if (step === 0) {
      return "h-full w-full sm:min-w-[375px] flex flex-col";
    }
    return "h-full w-full sm:min-w-[375px] min-h-[60vh] flex flex-col";
  }, [step]);

  return (
    <div className={className}>
      <div className="h-full flex flex-1 flex-col">
        <div
          className="flex-1 flex h-full flex-col gap-4 overflow-y-auto p-4"
          data-testid="security-dialog"
        >
          <DialogHeader>
            <div className="flex items-center justify-between pb-3">
              <DialogTitle>Edit Security</DialogTitle>
              <Close className="w-fit">
                <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-neutral-700 transition-colors hover:bg-neutral-800">
                  <Icon name="X" color="currentColor" size="lg" />
                </div>
              </Close>
            </div>
          </DialogHeader>
          <StepperDisplay steps={steps} activeStep={step} />
          {StepComponent && (
            <StepComponent
              onClose={onClose}
              onForward={forward}
              onBackward={backward}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;

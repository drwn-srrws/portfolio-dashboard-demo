import { Icon } from "@/components/Icon/Icon";

type Step = {
  label: string;
};

export const StepperDisplay = ({
  steps,
  activeStep = 0,
}: {
  steps: Step[];
  activeStep: number;
}) => {
  return (
    <div className="flex items-center justify-center sm:justify-start">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center">
            <div className="flex items-center ">
              <div
                className={`
                    flex items-center justify-center rounded-full w-8 h-8 text-lg font-medium
                    ${isActive || isCompleted ? "bg-blue-900 text-white" : "bg-neutral-800 text-neutral-400"}
                  `}
              >
                {isCompleted ? (
                  <Icon name="Check" color="currentColor" size="lg" />
                ) : (
                  index + 1
                )}
              </div>

              <div className="flex flex-col ml-3 ">
                <span
                  className={`text-base whitespace-nowrap ${isActive ? "text-white font-medium" : "text-neutral-400"}`}
                >
                  {step.label}
                </span>
              </div>
            </div>

            {!isLast && (
              <div className="h-px w-full max-w-20 min-w-10 mx-4 bg-neutral-800" />
            )}
          </div>
        );
      })}
    </div>
  );
};

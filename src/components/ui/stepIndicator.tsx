import { CheckIcon } from "lucide-react";

export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex gap-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCurrentStep = currentStep === stepNumber;
        const isLastStep = stepNumber === totalSteps;

        return (
          <span
            key={stepNumber}
            className={`heading-03-bold rounded-full text-center flex items-center justify-center w-20 h-20 ${
              isCurrentStep ? "bg-primary-yellow" : "border border-border"
            }`}
          >
            {isLastStep ? <CheckIcon className="w-10 h-10" /> : stepNumber}
          </span>
        );
      })}
    </div>
  );
};

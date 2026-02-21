"use client";
import React from "react";
import { toast } from "sonner";
import { useUpdate } from "@/context/UpdateContext";

interface FormState {
  message: string;
  success: boolean;
  issues?: string[];
}

interface UseToastFeedbackProps {
  state: FormState;
}

export const useToastFeedback = ({ state }: UseToastFeedbackProps) => {
  const { triggerUpdate } = useUpdate();

  const [loading, setLoading] = React.useState(false);

  const [loadingByIndex, setLoadingByIndexState] = React.useState<Record<number, boolean>>({});

  const setLoadingByIndex = (index: number, value: boolean) => {
    setLoadingByIndexState((prev) => ({ ...prev, [index]: value }));
  };

  const getLoadingByIndex = (index: number) => {
    return loadingByIndex[index] || false;
  };

  React.useEffect(() => {
    setLoading(false);
    setLoadingByIndexState({});
    if (state.success) {
      toast("Perfeito", {
        description: state.message,
      });
      triggerUpdate();
    }

    if (state.issues || (state.success == false && state.message)) {
      toast(`Ops, tivemos um erro: ${state.message}`, {
        description: (
          <div className="flex flex-col">
            {state.issues?.map((issue: any) => (
              <span key={issue} className="flex gap-1">
                {issue}
              </span>
            ))}
          </div>
        ),
      });
    }
  }, [state, triggerUpdate]);

  return {
    loading,
    setLoading,
    loadingByIndex,
    setLoadingByIndex,
    getLoadingByIndex,
  };
};

import { useCallback } from "react";
import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";

export const GlobalErrorOverlay = () => {
  const handleReload = useCallback(() => window.location.reload(), []);

  return (
    <div
      className="flex items-center justify-center flex-col h-screen w-screen bg-neutral-950 gap-4"
      data-testid="global-error-overlay"
    >
      <Icon name="TriangleAlert" color="currentColor" size={50} />
      <h3 className="max-w-[90%] whitespace-pre-line break-words text-center text-lg font-semibold ">
        Exception detected
      </h3>

      <p className="text-neutral-400 max-w-lg text-center break-words whitespace-pre-line text-base w-full">
        Reload the demo to try again.
      </p>

      <div className="flex gap-3 text-base">
        <Button
          variant={"outline"}
          className="text-base"
          onClick={handleReload}
        >
          Reload App
        </Button>
      </div>
    </div>
  );
};

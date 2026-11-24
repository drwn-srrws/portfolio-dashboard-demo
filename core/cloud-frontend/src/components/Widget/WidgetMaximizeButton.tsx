import { Icon } from "@/components/Icon/Icon";
import { Button } from "@components/ui";
import { cn } from "@/utils/utils";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

export const WidgetMaximizeButton = ({ id }: { id?: string }) => {
  const { isMaximized, toggleMaximize } = usePanelMaximize();

  return (
    <Button
      id={id}
      variant="outline"
      className={cn(
        "relative z-[2] rounded-lg p-2 hover:bg-transparent flex items-end gap-3 border-input"
      )}
      onClick={toggleMaximize}
    >
      {isMaximized ? (
        <Icon name="Minimize2" color="currentColor" size="lg" />
      ) : (
        <Icon name="Maximize2" color="currentColor" size="lg" />
      )}
    </Button>
  );
};

export default WidgetMaximizeButton;

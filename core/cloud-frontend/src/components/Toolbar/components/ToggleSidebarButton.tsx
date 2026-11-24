import { useSidebar } from "@components/ui/sidebar";
import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";

export const ToggleSidebarButton = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className="flex items-center justify-center bg-neutral-900"
    >
      <Icon name="Menu" size="lg" color="currentColor" />
    </Button>
  );
};

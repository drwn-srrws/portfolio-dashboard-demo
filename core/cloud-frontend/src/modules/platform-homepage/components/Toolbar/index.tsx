import { Icon } from "@/components/Icon/Icon";
import { Button } from "@/components/ui";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";

export const Toolbar = () => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4  bg-neutral-900 p-4 md:p-2">
      <div className="flex items-center gap-3">
        {isMobile && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="flex items-center justify-center bg-neutral-900"
            >
              <Icon name="Menu" size={16} color="currentColor" />
            </Button>
            <img
              src={import.meta.env.BASE_URL + "brand-full.svg"}
              alt="Brand Logo"
              width={80}
              height={32}
              className="h-11 py-2 pr-5 items-start"
            />
          </>
        )}
      </div>
    </div>
  );
};

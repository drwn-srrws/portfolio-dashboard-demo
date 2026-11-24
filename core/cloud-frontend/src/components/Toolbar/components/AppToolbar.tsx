import { useIsMobile } from "@hooks/useMobile";
import { MobileToolbar } from "./MobileToolbar";
import { DesktopToolbar } from "./DesktopToolbar";
import { ToolbarProps } from "../types/ToolbarProps";

export const AppToolbar = (props: ToolbarProps) => {
  const isMobile = useIsMobile();
  const ToolbarComponent = isMobile ? MobileToolbar : DesktopToolbar;
  return <ToolbarComponent {...props} />;
};

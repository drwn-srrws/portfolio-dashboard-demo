import { TabProvider } from "@/providers/TabProvider";
import { ReactNode, useCallback } from "react";
import { SecurityManagerTab } from "../../types/SecurityManagerTab";
import { useNavigate } from "react-router-dom";
import { routes } from "@/utils/routes";

export interface SecurityManagerTabProviderProps {
  tab: SecurityManagerTab;
  children?: ReactNode;
}

export const SecurityManagerTabProvider = ({
  tab,
  children,
}: SecurityManagerTabProviderProps) => {
  const navigate = useNavigate();

  const handleTabChange = useCallback(
    (tab: SecurityManagerTab) => {
      navigate(routes.securityManager(tab));
    },
    [navigate]
  );

  return (
    <TabProvider tab={tab} onTabChange={handleTabChange}>
      {children}
    </TabProvider>
  );
};

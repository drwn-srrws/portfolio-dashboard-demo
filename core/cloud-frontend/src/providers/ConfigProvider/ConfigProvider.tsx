import { JSX, useMemo } from "react";
import { FrontendConfigResponseGitRelease } from "@api/types";
import { useGetFrontendConfig } from "@api/endpoints/frontend-config/frontend-config";
import { config } from "@/config";
import { ConfigContext } from "./ConfigContext";

export const ConfigProvider = ({ children }: { children: JSX.Element }) => {
  const { data } = useGetFrontendConfig({
    request: {
      baseURL: import.meta.env.VITE_PUBLIC_API_URL,
    },
  });

  const gitRelease =
    (data?.gitRelease as FrontendConfigResponseGitRelease) ?? null;

  const contextValue = useMemo(
    () => ({ frontendConfig: config, gitRelease }),
    [gitRelease]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      <meta charSet="utf-8" />
      <title>{config.metadata.title}</title>
      {children}
    </ConfigContext.Provider>
  );
};

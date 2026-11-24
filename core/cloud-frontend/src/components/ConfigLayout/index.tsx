import { Outlet } from "react-router";
import { usePageConfig } from "@/hooks/usePageConfig";

export const ConfigLayout = () => {
  const { page } = usePageConfig();

  const title = page?.metadata?.title;

  return (
    <>
      {title && <title>{title}</title>}
      <Outlet />
    </>
  );
};

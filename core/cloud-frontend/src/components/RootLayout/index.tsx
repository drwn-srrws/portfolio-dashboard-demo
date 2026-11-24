import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

export const RootLayout = () => (
  <NuqsAdapter>
    <Outlet />
  </NuqsAdapter>
);

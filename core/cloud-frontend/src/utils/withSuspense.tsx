import { Suspense } from "react";
import { Loader } from "@/components/Loader";

export const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType>
) => (
  <Suspense fallback={<Loader message="Loading..." />}>
    <Component />
  </Suspense>
);

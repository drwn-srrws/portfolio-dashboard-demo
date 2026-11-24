import React from "react";

import { Skeleton } from "@components/ui/skeleton";

interface SkeletonWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeletonStyle?: React.CSSProperties;
  skeletonClassName?: string;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  isLoading,
  children,
  skeletonStyle,
  skeletonClassName,
}) => {
  return isLoading ? (
    <Skeleton style={skeletonStyle} className={skeletonClassName} />
  ) : (
    <>{children}</>
  );
};

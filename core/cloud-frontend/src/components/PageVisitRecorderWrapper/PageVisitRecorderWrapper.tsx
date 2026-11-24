import React, { useEffect, useRef } from "react";
import { findTrackablePage } from "./utils";
import { useLocation } from "react-router-dom";
import { usePageVisitRecorder } from "../../hooks/usePageVisitRecorder";

export const PageVisitRecorderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const lastRecordedPath = useRef<string | null>(null);
  const { recordPageVisit, trackablePages } = usePageVisitRecorder();
  const { pathname: currentPath } = useLocation();

  useEffect(() => {
    if (lastRecordedPath?.current === currentPath) {
      return;
    }

    const page = findTrackablePage(trackablePages, currentPath);
    lastRecordedPath.current = currentPath;

    if (page) {
      recordPageVisit({
        url: currentPath,
        title: page.title,
        icon: page.icon,
      });
    }
  }, [currentPath, recordPageVisit, trackablePages]);

  return <>{children}</>;
};

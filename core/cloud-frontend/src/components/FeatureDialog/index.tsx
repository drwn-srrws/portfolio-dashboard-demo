import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { useConfig } from "@providers/ConfigProvider/useConfig";
import { FeatureDialog as FeatureDialogComponent } from "./FeatureDialog";
import { FeatureDialogConfig } from "@/config/types";
import { useDialogStorage } from "./useDialogStorage";

const isPathMatch = (pathname: string, pages?: string[]): boolean => {
  if (!pages || pages.length === 0) return false;

  if (pages.includes("*")) return true;

  return pages.some((pagePath) => {
    const pattern = pagePath.endsWith("/*")
      ? `${pagePath.slice(0, -2)}/*`
      : pagePath;

    return matchPath(pattern, pathname) !== null;
  });
};

const haveArraysChanged = (
  arr1: FeatureDialogConfig[],
  arr2: FeatureDialogConfig[]
): boolean => {
  if (arr1.length !== arr2.length) return true;

  const keysSet = new Set(arr1.map((item) => item.key));

  for (let i = 0; i < arr2.length; i++) {
    if (!keysSet.has(arr2[i].key)) return true;

    if (arr1[i].key !== arr2[i].key) return true;
  }

  return false;
};

export const FeatureDialog = () => {
  const { featureDialogs = [] } = useConfig();
  const location = useLocation();
  const { pathname } = location;
  const [open, setOpen] = useState(false);
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);

  const [matchingDialogs, setMatchingDialogs] = useState<FeatureDialogConfig[]>(
    []
  );

  const stateRef = useRef({
    initialized: false,
    lastKey: "",
  });

  const dialogStorage = useDialogStorage(featureDialogs);

  useEffect(() => {
    if (stateRef.current.initialized || !featureDialogs.length) return;

    dialogStorage.cleanup();
    stateRef.current.initialized = true;
  }, [featureDialogs, dialogStorage]);

  useEffect(() => {
    if (!featureDialogs.length) return;

    const locationKey = location.key || pathname;

    if (stateRef.current.lastKey === locationKey) {
      return;
    }

    stateRef.current.lastKey = locationKey;

    const newMatchingDialogs = featureDialogs.filter(
      (dialog) =>
        !dialogStorage.isViewed(dialog.key) &&
        isPathMatch(pathname, dialog.pages)
    );

    if (haveArraysChanged(newMatchingDialogs, matchingDialogs)) {
      setMatchingDialogs(newMatchingDialogs);

      if (newMatchingDialogs.length > 0 && !open) {
        setCurrentDialogIndex(0);
        setOpen(true);
      } else if (newMatchingDialogs.length === 0 && open) {
        setOpen(false);
      }
    }
  }, [
    pathname,
    location.key,
    featureDialogs,
    matchingDialogs,
    open,
    dialogStorage,
  ]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        const currentDialog = matchingDialogs[currentDialogIndex];

        if (currentDialog) {
          dialogStorage.markAsViewed(currentDialog.key);

          const nextIndex = currentDialogIndex + 1;
          if (nextIndex < matchingDialogs.length) {
            setCurrentDialogIndex(nextIndex);
          } else {
            setOpen(false);
          }
        }
      } else {
        setOpen(isOpen);
      }
    },
    [matchingDialogs, currentDialogIndex, dialogStorage]
  );

  if (!matchingDialogs.length) return null;

  const currentDialog = matchingDialogs[currentDialogIndex];
  if (!currentDialog) return null;

  return (
    <FeatureDialogComponent
      key={`dialog-${currentDialog.key}`}
      config={currentDialog}
      open={open}
      onOpenChange={handleOpenChange}
    />
  );
};

import { useEffect, useState } from "react";
import { usePanel } from "@providers/PanelProvider";

export const usePanelMaximize = () => {
  const { containerApi, api } = usePanel();

  const [isMaximized, setIsMaximized] = useState<boolean>(
    containerApi.hasMaximizedGroup()
  );

  const toggleMaximize = () => {
    if (containerApi.hasMaximizedGroup()) {
      containerApi.exitMaximizedGroup();
    } else {
      api.maximize();
    }
  };

  useEffect(() => {
    const disposable = containerApi.onDidMaximizedGroupChange(() => {
      setIsMaximized(api.isMaximized());
    });

    return () => {
      disposable.dispose();
    };
  }, [api, containerApi]);

  return { isMaximized, toggleMaximize };
};

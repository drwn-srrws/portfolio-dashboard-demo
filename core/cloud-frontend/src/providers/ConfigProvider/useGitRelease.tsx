import { useContext } from "react";
import { ConfigContext } from "./ConfigContext";

export const useGitRelease = () => {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error("useGitRelease must be used within a GitReleaseProvider");
  }

  return context.gitRelease;
};

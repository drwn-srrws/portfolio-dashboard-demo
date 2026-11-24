import { useContext } from "react";
import { ChangeHistoryContext } from "./ChangeHistoryContext";

export function useChangeHistory() {
  const context = useContext(ChangeHistoryContext);

  if (!context) {
    throw new Error(
      "useChangeHistory must be used within ChangeHistoryProvider"
    );
  }

  const { ...rest } = context;
  return rest;
}

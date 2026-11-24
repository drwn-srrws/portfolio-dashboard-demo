import { useContext } from "react";
import { EditTableContext } from "./EditTableContext";

export const useEditTable = () => {
  const context = useContext(EditTableContext);

  if (!context) {
    throw new Error("useEditTable must be used within an EditTableProvider");
  }

  return context;
};

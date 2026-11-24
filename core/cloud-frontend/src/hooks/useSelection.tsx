import { useCallback, useState } from "react";

export const useSelection = <T extends object>(defaultValues: T) => {
  const [selection, setSelection] = useState<T>(defaultValues);

  const updateSelection = useCallback((type: keyof T, value: T[keyof T]) => {
    setSelection((prev) => ({
      ...prev,
      [type]: value,
    }));
  }, []);

  const resetSelection = useCallback(
    (type: keyof T) => {
      setSelection((prev) => ({
        ...prev,
        [type]: defaultValues[type],
      }));
    },
    [defaultValues]
  );

  const handleSelectionReset = useCallback(
    (type: keyof T) => () => {
      resetSelection(type);
    },
    [resetSelection]
  );

  const handleSelectionChange = useCallback(
    (type: keyof T) => (value: unknown) => {
      updateSelection(type, value as T[keyof T]);
    },
    [updateSelection]
  );

  return {
    selection,
    resetSelection,
    updateSelection,
    handleSelectionReset,
    handleSelectionChange,
  };
};

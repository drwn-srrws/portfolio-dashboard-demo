import { useCallback, useEffect } from "react";

export const KEY_NAME_ESC = "Escape";
export const KEY_NAME_ENTER = "Enter";
const KEY_EVENT_TYPE = "keyup";

export enum RecognizedKeys {
  ESC = "Escape",
  ENTER = "Enter",
}

export const useKeyHandler = (key: RecognizedKeys, onKeyEvent: () => void) => {
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) onKeyEvent();
    },
    [key, onKeyEvent]
  );

  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleKey, false);

    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleKey, false);
    };
  }, [handleKey]);
};

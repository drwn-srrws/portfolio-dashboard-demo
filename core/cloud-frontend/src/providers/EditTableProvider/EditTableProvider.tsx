import { ReactNode, useState } from "react";
import { EditTableContext } from "./EditTableContext";

export const EditTableProvider = ({ children }: { children: ReactNode }) => {
  const [isEditable, setIsEditable] = useState(false);

  const [discardDialogData, setDiscardDialogData] = useState<{
    isOpen: boolean;
    callback: (() => void) | null;
  }>({
    isOpen: false,
    callback: null,
  });

  const handleClose = () =>
    setDiscardDialogData({
      isOpen: false,
      callback: null,
    });

  const onDiscard = () => {
    handleClose();
    setIsEditable(false);

    if (discardDialogData.callback) discardDialogData?.callback();
  };

  const showDiscardDialog = (cb: () => void) => {
    setDiscardDialogData({
      isOpen: true,
      callback: cb,
    });
  };

  const hideDiscardDialog = () => {
    setDiscardDialogData({
      isOpen: false,
      callback: null,
    });
  };

  const Provider = EditTableContext.Provider;

  return (
    <Provider
      value={{
        isEditable,
        showDiscardDialog,
        hideDiscardDialog,
        discardDialogData,

        setIsEditable,
        handleClose,
        onDiscard,
      }}
    >
      {children}
    </Provider>
  );
};

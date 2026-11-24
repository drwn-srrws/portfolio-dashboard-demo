import { Dispatch, SetStateAction, createContext } from "react";

export interface IEditTableContext {
  discardDialogData: {
    isOpen: boolean;
    callback: (() => void) | null;
  };
  showDiscardDialog: (cb: () => void) => void;
  hideDiscardDialog: () => void;
  isEditable: boolean;
  setIsEditable: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  onDiscard: () => void;
}

export const EditTableContext = createContext<IEditTableContext | null>(null);

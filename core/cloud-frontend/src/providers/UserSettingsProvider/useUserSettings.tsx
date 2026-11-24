import { useContext } from "react";
import {
  IUserSettingsContext,
  UserSettingsContext,
} from "./UserSettingsContext";

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext) as IUserSettingsContext;

  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }

  return context;
};

import { createContext } from "react";

export interface IUserSettingsContext {
  setValue: (key: string, value: unknown) => void;
  getValue: (key: string) => unknown;
  resetValuesByKey: (keys: string[]) => void;
  resetValuesByPrefix: (prefix: string) => void;
}

export const UserSettingsContext = createContext<IUserSettingsContext>(
  {} as IUserSettingsContext
);

import { ReactNode, useEffect } from "react";
import { UserSettingsContext } from "./UserSettingsContext";

const localStorageKey = "user-settings";

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const Provider = UserSettingsContext.Provider;

  useEffect(() => {
    const storedData = localStorage.getItem(localStorageKey);

    if (!storedData) localStorage.setItem(localStorageKey, "{}");
  }, []);

  const getUserSettings = () => {
    const rawStoredData = localStorage.getItem(localStorageKey);
    const parsed = JSON.parse(rawStoredData || "{}");

    return parsed;
  };

  const setValue = (key: string, value: unknown) => {
    const newSettings = { ...getUserSettings(), [key]: value };

    localStorage.setItem(localStorageKey, JSON.stringify(newSettings));
  };

  const getValue = (key: string) => {
    const data = getUserSettings();

    return data[key] || null;
  };

  const resetValuesByKey = (keys: string[]) => {
    const newSettings = { ...getUserSettings() };

    keys.forEach((key) => delete newSettings[key]);

    localStorage.setItem(localStorageKey, JSON.stringify(newSettings));
  };

  const resetValuesByPrefix = (prefix: string) => {
    const newSettings = { ...getUserSettings() };

    Object.keys(newSettings).forEach((key) => {
      if (key.startsWith(prefix)) delete newSettings[key];
    });

    localStorage.setItem(localStorageKey, JSON.stringify(newSettings));
  };

  return (
    <Provider
      value={{ setValue, getValue, resetValuesByKey, resetValuesByPrefix }}
    >
      {children}
    </Provider>
  );
};

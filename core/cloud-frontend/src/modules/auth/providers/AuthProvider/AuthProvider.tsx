import type { ReactNode } from "react";
import type { LoginResponse } from "@api/types";
import { AuthContext } from "./AuthContext";

// Existing dashboard components use the analyst role to select demo features.
const demoViewer: LoginResponse = {
  id: 1,
  email: "viewer@example.test",
  first_name: "Demo",
  last_name: "Viewer",
  role: { name: "analyst" },
  roles: [{ name: "analyst" }],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider
    value={{ account: demoViewer }}
  >
    {children}
  </AuthContext.Provider>
);

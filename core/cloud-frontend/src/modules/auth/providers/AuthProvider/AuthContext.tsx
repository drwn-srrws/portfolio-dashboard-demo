import { createContext } from "react";
import type { LoginResponse } from "@api/types";

export const AuthContext = createContext<{ account: LoginResponse | null }>({
  account: null,
});

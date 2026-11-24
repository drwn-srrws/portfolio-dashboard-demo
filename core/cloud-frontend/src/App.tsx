import "./globals.css";

import { BrowserRouter, HashRouter } from "react-router-dom";
import { AppRoutes } from "@components/AppRoutes";
import { AppProviders } from "@components/AppProviders";

const Router = import.meta.env.MODE === "pages" ? HashRouter : BrowserRouter;

export const App = () => (
  <Router>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </Router>
);

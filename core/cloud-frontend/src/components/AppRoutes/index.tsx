import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@components/MainLayout/MainLayout";
import { ConfigLayout } from "../ConfigLayout";
import { RootLayout } from "../RootLayout";
import { PositionExposureOptimizedPage } from "@modules/portfolio/position-exposure-optimized";
import { PositionDifferencesOptimizedPage } from "@modules/portfolio/position-differences-optimized";
import { PerformanceSummaryOptimizedPage } from "@modules/portfolio/performance-summary-optimized";

export const AppRoutes = () => (
  <Routes>
    <Route element={<RootLayout />}>
      <Route element={<MainLayout />}>
        <Route element={<ConfigLayout />}>
          <Route
            path="/portfolio/position-exposure"
            element={<PositionExposureOptimizedPage />}
          />
          <Route
            path="/portfolio/position-differences"
            element={<PositionDifferencesOptimizedPage />}
          />
          <Route
            path="/portfolio/performance-summary"
            element={<PerformanceSummaryOptimizedPage />}
          />
          <Route
            path="*"
            element={<Navigate to="/portfolio/position-exposure" replace />}
          />
        </Route>
      </Route>
    </Route>
  </Routes>
);

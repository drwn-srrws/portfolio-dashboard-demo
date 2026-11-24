import { Outlet } from "react-router-dom";
import { AppSidebar } from "@components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import { Toaster } from "@components/ui/toaster";
import { FeatureDialog } from "@components/FeatureDialog";
import { UserSettingsProvider } from "@providers/UserSettingsProvider";
import { useStore } from "@store/index";
import { NotificationsBanner } from "@components/NotificationsBanner";

export const MainLayout = () => {
  const { isSidebarOpen, setSidebarOpen } = useStore();

  return (
    <UserSettingsProvider>
      <div>
        <NotificationsBanner />
      </div>
      <div className="h-full overflow-hidden relative">
        <SidebarProvider open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <AppSidebar />
          <SidebarInset>
            <div className="absolute inset-0 flex flex-col overflow-y-auto">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Toaster />
      <FeatureDialog />
    </UserSettingsProvider>
  );
};

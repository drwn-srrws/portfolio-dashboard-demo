import { usePageConfig } from "@/hooks/usePageConfig";
import { AccessGuard } from "../AccessGuard";

export const ConfigGuard = () => {
  const { page } = usePageConfig();

  const allowedRoles = page?.auth?.allowedRoles;
  const allowedEmails = page?.auth?.allowedEmails;
  const deniedEmails = page?.auth?.deniedEmails;
  return (
    <AccessGuard
      allowedRoles={allowedRoles}
      allowedEmails={allowedEmails}
      deniedEmails={deniedEmails}
    />
  );
};

import { Link2OffIcon } from "lucide-react";
import { BaseOverlay } from "./BaseOverlay";

export const NotFoundOverlay = () => (
  <BaseOverlay
    icon={<Link2OffIcon />}
    title="Error 404"
    description="Page not found"
  />
);

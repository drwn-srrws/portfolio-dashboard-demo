import { Link2OffIcon } from "lucide-react";

import { BaseOverlay, BaseOverlayProps } from "./BaseOverlay";

export type ErrorOvelayProps = Partial<BaseOverlayProps>;

export const ErrorOverlay = ({
  icon = <Link2OffIcon />,
  description = "Something went wrong, please try againg later",
  testId = "error-overlay",
  ...props
}: ErrorOvelayProps) => (
  <BaseOverlay
    {...props}
    icon={icon}
    description={description}
    testId={testId}
  />
);

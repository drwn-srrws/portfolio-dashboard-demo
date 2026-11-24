import { DatabaseZap } from "lucide-react";

import { BaseOverlay, BaseOverlayProps } from "./BaseOverlay";

export type NoDataOverlayProps = Partial<BaseOverlayProps>;

export const NoDataOverlay = ({
  icon = <DatabaseZap />,
  title = "No data to display",
  description = "Please make a different filter selection",
  testId = "no-data-overlay",
  ...props
}: NoDataOverlayProps) => (
  <BaseOverlay
    {...props}
    icon={icon}
    description={description}
    title={title}
    testId={testId}
  />
);

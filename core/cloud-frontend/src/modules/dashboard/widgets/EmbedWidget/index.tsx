import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";

import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";

export interface EmbedWidgetProps {
  src: string;
  cardName: string;
}

const EmbedWidgetContent = ({ src, cardName }: EmbedWidgetProps) => (
  <WidgetWrapper>
    <WidgetHeader>
      <WidgetTitle>{cardName}</WidgetTitle>
      <WidgetMaximizeButton />
    </WidgetHeader>
    <WidgetBody>
      <iframe src={src} className="size-full" />
    </WidgetBody>
  </WidgetWrapper>
);

export const EmbedWidget = withAppInsights(EmbedWidgetContent, "EmbedWidget");

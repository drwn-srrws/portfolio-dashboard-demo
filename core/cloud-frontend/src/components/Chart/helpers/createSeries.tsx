import { SeriesType } from "lightweight-charts";
import { Series, SeriesProps } from "../components/Series";

export const createSeries = <T extends SeriesType>(type: T) => {
  const Component = (props: Omit<SeriesProps<T>, "type">) => (
    <Series {...props} type={type} />
  );

  Component.displayName = `${type}Series`;

  return Component;
};

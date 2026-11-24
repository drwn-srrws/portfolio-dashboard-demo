import { IDockviewPanelProps } from "dockview-react";
import {
  ColorType,
  createChart,
  IChartApi,
  SolidColor,
} from "lightweight-charts";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface ChartRef {
  isRemoved: boolean;
}

export interface ChartOptions {
  background?: SolidColor;
  textColor?: string;
  height?: number;
  grid?: {
    vertLineColor?: string;
    horzLineColor?: string;
  };
  rightPriceScale?: {
    visible?: boolean;
    borderColor?: string;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
  };
  leftPriceScale?: {
    visible?: boolean;
    borderColor?: string;
    scaleMargins?: {
      top?: number;
      bottom?: number;
    };
  };
  timeScale?: { borderColor: string };
  crosshairMode?: number;
}

interface useChartProps {
  contentOffset?: number;
  isFullWidth?: boolean;
  isLeftPriceScaleVisible?: boolean;
  chartOptions?: ChartOptions;
  panelProps?: IDockviewPanelProps;
  updateMaxVisibleItems: (width: number) => void;
}

export const useChart = ({
  contentOffset = 0,
  isFullWidth = false,
  isLeftPriceScaleVisible = false,
  chartOptions,
  panelProps,
  updateMaxVisibleItems,
}: useChartProps) => {
  const divider = isFullWidth ? 1 : 2;
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartRef>({ isRemoved: false });

  const [chartApi, setChartApi] = useState<IChartApi | null>(null);

  const resizeHandler = useCallback(
    (chart: IChartApi, data: { width: number; height: number }) => {
      if (!ref.current) return;

      const height = Math.abs(data.height - 80 - contentOffset);
      const width = Math.abs(data.width / divider - 30);

      chart.applyOptions({
        width: width,
        height: height,
      });

      chart.timeScale().fitContent();
    },
    [divider, contentOffset]
  );

  const getPanelDimensions = () => {
    const height = Math.abs(
      (panelProps?.api?.height || 300) - 80 - contentOffset
    );
    const width = Math.abs((panelProps?.api?.width || 50) / divider - 30);
    return { height, width };
  };

  useEffect(() => {
    if (!ref.current) return;

    const { height, width } = getPanelDimensions();

    const chartApi = createChart(ref.current, {
      width,
      height,
      autoSize: true,
      layout: {
        background: {
          type: ColorType.Solid,
          color: chartOptions?.background?.color || "#000000",
        },
        textColor: chartOptions?.textColor || "#FFFFFF",
      },
      grid: {
        vertLines: chartOptions?.grid?.vertLineColor
          ? { color: chartOptions.grid.vertLineColor }
          : { color: "#111212" },
        horzLines: chartOptions?.grid?.horzLineColor
          ? { color: chartOptions.grid.horzLineColor }
          : { color: "#111212" },
      },
      rightPriceScale: {
        visible: chartOptions?.rightPriceScale?.visible || false,
        borderColor: chartOptions?.rightPriceScale?.borderColor || "#fff",
        scaleMargins: chartOptions?.rightPriceScale?.scaleMargins,
      },
      leftPriceScale: {
        borderColor: chartOptions?.leftPriceScale?.borderColor || "#fff",
        scaleMargins: chartOptions?.leftPriceScale?.scaleMargins,
      },
      timeScale: {
        borderColor: chartOptions?.timeScale?.borderColor || "#fff",
      },
      crosshair: {
        mode: chartOptions?.crosshairMode || 0,
      },
    });

    chartApi.timeScale().fitContent();
    updateMaxVisibleItems(width);
    setChartApi(chartApi);
    chartRef.current.isRemoved = false;

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chartRef.current.isRemoved = true;
      chartApi.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!chartApi || !panelProps?.api.onDidDimensionsChange) return;

    const handleResize = (data: { width: number; height: number }) => {
      updateMaxVisibleItems(data.width);
      resizeHandler(chartApi, data);
    };

    panelProps.api.onDidDimensionsChange(handleResize);

    return () => {
      panelProps.api.onDidDimensionsChange(handleResize);
    };
  }, [
    chartApi,
    chartOptions,
    contentOffset,
    isFullWidth,
    panelProps?.api,
    resizeHandler,
    updateMaxVisibleItems,
  ]);

  useEffect(() => {
    if (!chartApi) return;
    chartApi.priceScale("left").applyOptions({
      visible: isLeftPriceScaleVisible,
    });
  }, [chartApi, isLeftPriceScaleVisible]);

  return { ref, chartRef, chartApi };
};

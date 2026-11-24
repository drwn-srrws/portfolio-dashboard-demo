import { RefObject } from "react";

import { Button } from "@components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

import { MultiChartSeriesData } from "../..";

import { Chip } from "@/components/Chip";

interface LegendProps {
  data: MultiChartSeriesData[];
  legendRef: RefObject<HTMLDivElement | null>;
  maxVisibleItems: number;
  inactiveSeriesIds: (string | number)[];
  isDualAxis?: boolean;
  toggleSeriesVisibility: (id: string | number) => void;
}

export const Legend = ({
  data,
  legendRef,
  maxVisibleItems,
  inactiveSeriesIds,
  isDualAxis,
  toggleSeriesVisibility,
}: LegendProps) => (
  <div ref={legendRef} className="mb-2 flex flex-wrap gap-2">
    {data.slice(0, maxVisibleItems).map(({ name, color, id, metricName }) => (
      <div key={id} onClick={() => toggleSeriesVisibility(id)}>
        <Chip
          key={id}
          name={`${name} ${isDualAxis ? `- ${metricName}` : ""}`}
          color={color}
          className={`rounded-sm bg-neutral-800 p-1 pr-2 ${
            inactiveSeriesIds.includes(id) && "opacity-60"
          }`}
        />
      </div>
    ))}
    {data.length > maxVisibleItems && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-[4px] pr-2">
            <span>+ {data.length - maxVisibleItems} More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-52 overflow-y-auto">
          {data
            .slice(maxVisibleItems)
            .map(({ name, color, id, metricName }) => (
              <DropdownMenuItem
                key={id}
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  toggleSeriesVisibility(id);
                }}
              >
                <Chip
                  name={`${name} ${isDualAxis ? `- ${metricName}` : ""}`}
                  color={color}
                  className={`${inactiveSeriesIds.includes(id) && "opacity-60"}`}
                />
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  </div>
);

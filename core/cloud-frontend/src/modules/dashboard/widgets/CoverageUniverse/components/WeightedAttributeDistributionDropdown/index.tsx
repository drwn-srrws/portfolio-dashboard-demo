import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Chip } from "@/components/Chip";
import { Icon } from "@/components/Icon/Icon";
import { PercentageBar } from "../PercentageBar";
import { WeightedAttributeItem } from "../WeightedAttributeChip";
import { useState } from "react";
import { defaultPercentageBarColors } from "../../constants/percentageBarColors";

export interface WeightedAttributeDistributionDropdownProps {
  isOpen: boolean;
  items: WeightedAttributeItem[];
  onOpenChange: (open: boolean) => void;
}

export const WeightedAttributeDistributionDropdown = ({
  items,
  isOpen,
  onOpenChange,
}: WeightedAttributeDistributionDropdownProps) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-start hover:bg-transparent hover:text-current p-0"
        >
          <div className="flex items-center justify-between w-full px-2 py-1 hover:bg-neutral-800/30 rounded cursor-pointer group transition-all duration-200">
            <div className="flex-grow mr-3">
              <PercentageBar tags={items} />
            </div>
            <Icon name="ChevronDown" color="#FAFAFA" size="lg" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="z-[50] w-[300px] mt-[15px] rounded-[8px] bg-[#171717] p-0 text-white shadow-md border-neutral-700 border">
          <div className="flex flex-col">
            <div className="flex border-b border-neutral-700 p-0">
              <div className="flex items-center px-3 py-1 w-full">
                <Search className="h-5 w-5 text-neutral-500" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-0 border-none focus-within:ring-0 focus-within:!ring-offset-0"
                  placeholder="Search"
                />
              </div>
            </div>
            <div className="p-2 space-y-4">
              {filteredItems.length === 0 ? (
                <div className="px-1 py-2 text-sm text-neutral-400 italic">
                  No tags
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-2"
                  >
                    <Chip
                      name={item.label}
                      color={
                        defaultPercentageBarColors[
                          index % defaultPercentageBarColors.length
                        ]
                      }
                      size="md"
                      variant="filled"
                    />
                    <span className="text-sm text-neutral-300 tabular-nums">
                      {item.value > 0 && item.value < 0.01
                        ? "< 0.01%"
                        : `${item.value.toFixed(2)}%`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

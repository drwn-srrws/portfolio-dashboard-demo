import { omit } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";

import { MetricCatalogItem } from "@api/types/index";
import { Icon } from "@/components/Icon/Icon";
import { Popover } from "@components/Popover/Popover";
import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { Input } from "@components/ui/index";
import { VirtualList } from "@components/VirtualList";
import { useDockview } from "@/providers/DockviewProvider";
import { usePanel } from "@/providers/PanelProvider";

import {
  getFiltersWithDeprecatedOptions,
  mapFilterOptionsToSelectOptions,
  processFilterFieldsWithDeprecated,
} from "../utils";
import { Selectable } from "@/typings/Selectable";
import { Filters } from "@/typings/Filters";

export interface IFilterPanelProps {
  filterOptions: MetricCatalogItem[];
  selectedFilters: Filters;
  id?: string;
  testId?: string;
  defaultFilters?: Filters;
  usePortal?: boolean;
  disableSubFilterPortal?: boolean;
  setSelectedFilters: (filters: Filters) => void;
}

const FilterPanel = ({
  defaultFilters,
  filterOptions,
  selectedFilters,
  testId,
  usePortal = false,
  disableSubFilterPortal = false,
  setSelectedFilters,
}: IFilterPanelProps) => {
  const dockViewPanelProps = usePanel();
  const { updateComponent } = useDockview();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(
    () => mapFilterOptionsToSelectOptions(filterOptions),
    [filterOptions]
  );

  const filterOptionsWithDeprecated = useMemo(() => {
    return getFiltersWithDeprecatedOptions(filteredOptions, selectedFilters);
  }, [filteredOptions, selectedFilters]);

  const { existingFiltersFields, missingFiltersFields } = useMemo(
    () => processFilterFieldsWithDeprecated(filterOptions, selectedFilters),
    [filterOptions, selectedFilters]
  );

  const handleAddNewFilter = (filterName: string) => {
    setSelectedFilters({ ...selectedFilters, [filterName]: [] });
  };

  const handleFilterChange = (field: string, value: Selectable["value"][]) => {
    setSelectedFilters({ ...selectedFilters, [field]: value });
  };

  const handleRemoveFilter = (field: string) => {
    setSelectedFilters(omit([field], selectedFilters));
  };

  const removeFilterAndUpdateComponent = (field: string) => {
    handleRemoveFilter(field);

    if (dockViewPanelProps?.api?.id) {
      const updatedFilters = omit(
        [field],
        dockViewPanelProps.params.filterSettings.filters
      );

      updateComponent(dockViewPanelProps.api.id, {
        ...dockViewPanelProps.params,
        filterSettings: {
          ...dockViewPanelProps.params.filterSettings,
          filters: updatedFilters,
        },
      });
    }
  };

  const availableFilters = useMemo(() => {
    return filterOptionsWithDeprecated.filter(
      (filter) =>
        !existingFiltersFields.includes(filter.name) &&
        filter.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filterOptionsWithDeprecated, existingFiltersFields, searchTerm]);

  const getOptions = useCallback(
    (field: string) =>
      filterOptionsWithDeprecated.find((opt) => opt.name === field)?.options ||
      [],
    [filterOptionsWithDeprecated]
  );

  const getPlaceholder = useCallback(
    (field: string) =>
      filterOptionsWithDeprecated.find((opt) => opt.name === field)?.label ||
      "",
    [filterOptionsWithDeprecated]
  );

  useEffect(() => {
    if (defaultFilters) {
      setSelectedFilters(defaultFilters);
    }
  }, [defaultFilters, setSelectedFilters]);

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-3 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center">
            <Popover
              usePortal={usePortal}
              buttonText={
                <div
                  className="flex items-center gap-1 text-foreground"
                  data-testid={`${testId}-trigger`}
                >
                  <Icon name="CirclePlus" size="md" color="currentColor" />
                  <span className="text-base font-medium leading-[1]">
                    Add filter
                  </span>
                </div>
              }
              className={{
                contentWrapper:
                  "rounded-2xl border border-neutral-700 bg-[var(--neutral-900)] p-0 pb-1",
                button: "rounded-[8px] border border-neutral-700",
              }}
            >
              <div>
                <div className="flex border-b border-neutral-700">
                  <div className="flex items-center gap-1 p-0.5 pl-3">
                    <Icon name="Search" size="lg" color="#B3B3B3" />
                    <Input
                      className="w-full border-none bg-[var(--neutral-900)] pl-1 text-white placeholder:text-gray-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0"
                      placeholder="Search Filters"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="py-1 pl-1">
                  <ul>
                    {availableFilters.length > 0 ? (
                      <VirtualList maxHeight={200} items={availableFilters}>
                        {(filter) => (
                          <div key={filter.name} className="pr-1">
                            <li
                              key={filter.name}
                              className="cursor-pointer rounded-md p-2 hover:bg-gray-700"
                              onClick={() => handleAddNewFilter(filter.name)}
                              data-testid={filter.name}
                            >
                              {filter.label}
                            </li>
                          </div>
                        )}
                      </VirtualList>
                    ) : (
                      <li className="p-2 text-gray-500">No filters found</li>
                    )}
                  </ul>
                </div>
              </div>
            </Popover>
          </div>

          {existingFiltersFields.map((field: string) => (
            <BadgeMultiSelect
              key={field}
              value={selectedFilters[field]}
              options={getOptions(field)}
              alwaysShowPlaceholder
              placeholder={getPlaceholder(field)}
              onChange={(value) => handleFilterChange(field, value)}
              hasRemoveAction
              onRemoveActionClick={() => handleRemoveFilter(field)}
              testId={`${testId}-${field}`}
              disablePortal={disableSubFilterPortal}
            />
          ))}

          {missingFiltersFields.map((field: string) => (
            <BadgeMultiSelect
              key={field}
              value={selectedFilters[field]}
              alwaysShowPlaceholder
              hasRemoveAction
              deprecated={true}
              options={getOptions(field)}
              placeholder={
                getPlaceholder(field) ? getPlaceholder(field) : field
              }
              onChange={(value) => handleFilterChange(field, value)}
              onRemoveActionClick={() => removeFilterAndUpdateComponent(field)}
              testId={`${testId}-${field}`}
              disablePortal={disableSubFilterPortal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

export type FilteringPredicate<TFilters, TRow, TContext = unknown> = (
  filters: Partial<TFilters>,
  rows: TRow[],
  context?: TContext
) => boolean;

export type FilteringFunction<TFilters, TRow, TContext = unknown> = (
  filters: Partial<TFilters>,
  rows: TRow[],
  context?: TContext
) => TRow[];

export type FilterHandler<TFilters, TRow, TContext = unknown> = (
  filters: Partial<TFilters>,
  context?: TContext
) => (rows: TRow[]) => TRow[];

export type FilterObjectDefinition<TFilters, TRow, TContext = unknown> = {
  howToFilter: FilteringFunction<TFilters, TRow, TContext>;
  whenToFilter?: keyof TFilters | FilteringPredicate<TFilters, TRow, TContext>;
};

export type FilterTupleDefinition<TFilters, TRow, TContext = unknown> = [
  FilteringFunction<TFilters, TRow, TContext>,
  keyof TFilters,
];

export type FiltersMap<TFilters, TRow, TContext = unknown> = {
  [key in keyof TFilters]:
    | FilterObjectDefinition<TFilters, TRow, TContext>
    | ((key: keyof TFilters) => FilteringFunction<TFilters, TRow, TContext>)
    | FilterTupleDefinition<TFilters, TRow, TContext>
    | FilteringFunction<TFilters, TRow, TContext>[];
};

const defaultWhenToFilter = <TFilters>(
  filters: Partial<TFilters>,
  property: keyof TFilters
): boolean => {
  if (!filters || !filters[property]) return false;
  else if (typeof filters[property] === "string")
    return (filters[property] as string).length > 0;
  else if (
    typeof filters[property] === "number" ||
    typeof filters[property] === "boolean"
  )
    return true;
  else if (Array.isArray(filters[property]))
    return (filters[property] as unknown[]).length > 0;
  else return true;
};

const createFilterHandler =
  <TFilters, TRow, TContext = unknown>(
    howToFilter: FilteringFunction<TFilters, TRow, TContext>,
    whenToFilter: keyof TFilters | FilteringPredicate<TFilters, TRow, TContext>
  ): FilterHandler<TFilters, TRow, TContext> =>
  (filters: Partial<TFilters>, context?: TContext) =>
  (rows: TRow[]) => {
    let shouldFilter = false;

    if (typeof whenToFilter === "string")
      shouldFilter = defaultWhenToFilter(filters, whenToFilter);
    else
      shouldFilter = (
        whenToFilter as FilteringPredicate<TFilters, TRow, TContext>
      )(filters, rows, context);

    return shouldFilter ? howToFilter(filters, rows, context) : rows;
  };

const handleFilterObject =
  <TFilters, TRow, TContext = unknown>(
    filter: FilterObjectDefinition<TFilters, TRow, TContext>,
    key: keyof TFilters
  ) =>
  (filters: Partial<TFilters>, context?: TContext) =>
  (rows: TRow[]) =>
    createFilterHandler(
      filter.howToFilter,
      filter.whenToFilter ? filter.whenToFilter : (key as keyof TFilters)
    )(
      filters,
      context
    )(rows);

const handleFilterTuple =
  <TFilters, TRow, TContext = unknown>(
    filters: FilterTupleDefinition<TFilters, TRow, TContext>
  ) =>
  (filterValues: Partial<TFilters>, context?: TContext) =>
  (rows: TRow[]) => {
    return createFilterHandler(
      filters[0] as FilteringFunction<TFilters, TRow, TContext>,
      filters[1] as keyof TFilters
    )(
      filterValues,
      context
    )(rows);
  };

const handleFilterArray =
  <TFilters, TRow, TContext = unknown>(
    filters: FilteringFunction<TFilters, TRow, TContext>[]
  ) =>
  (filterValues: Partial<TFilters>, context?: TContext) =>
  (rows: TRow[]) => {
    return filters.reduce(
      (acc, filter) => filter(filterValues, acc, context),
      rows
    );
  };

export const filterRows =
  <TFilters, TRow, TContext = unknown>(
    filtersMap: FiltersMap<TFilters, TRow, TContext>
  ) =>
  (filters: Partial<TFilters>, context?: TContext) =>
  (rows: TRow[]) => {
    let filteredRows = [...rows];

    Object.keys(filtersMap).forEach((key) => {
      const currentFilter = filtersMap[key as keyof TFilters];

      let filteringFunc;

      if (!currentFilter) return;
      if (typeof currentFilter === "function") {
        filteringFunc = createFilterHandler(
          currentFilter(key as keyof TFilters),
          key as keyof TFilters
        );
      } else if (
        Array.isArray(currentFilter) &&
        typeof currentFilter[1] === "string"
      ) {
        filteringFunc = handleFilterTuple(
          currentFilter as FilterTupleDefinition<TFilters, TRow, TContext>
        );
      } else if (Array.isArray(currentFilter)) {
        filteringFunc = handleFilterArray(
          currentFilter as FilteringFunction<TFilters, TRow, TContext>[]
        );
      } else if (typeof currentFilter === "object") {
        filteringFunc = handleFilterObject(
          currentFilter as FilterObjectDefinition<TFilters, TRow, TContext>,
          key as keyof TFilters
        );
      } else throw new Error("Invalid filter definition");

      filteredRows = filteringFunc(filters, context)(filteredRows);
    });

    return filteredRows;
  };

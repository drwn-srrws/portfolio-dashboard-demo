import { isAfter, isBefore, isSameDay } from "date-fns";
import { Path, path } from "ramda";

import { DateRange, parseDateString } from "@/utils/index";

import { FilteringFunction } from "./filtering";

export const filterByStringProperties =
  <TFilters, TRow>(props: Path[]) =>
  (key: keyof TFilters): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter((row) =>
      props.find((prop) => {
        const value = path(prop, row) as string;

        if (!value) return false;
        if (typeof value !== "string")
          throw new Error(
            `Invalid search property type, expected string, received ${typeof value}`
          );

        if (typeof filters[key] === "string")
          return value
            .toLowerCase()
            .includes((filters[key] as string).toLowerCase());
        else
          throw new Error(
            `Invalid search property type, expected string, received ${typeof filters[key]}`
          );
      })
    );

export const filterByIsLessThan =
  <TFilters, TRow>(pathToProp: Path, value: number | Path) =>
  (): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter(
      (row) =>
        (path(pathToProp, row) as number) <
        (typeof value === "number" ? value : (path(value, filters) as number))
    );

export const filterByIsGTE =
  <TFilters, TRow>(pathToProp: Path, value: number | Path) =>
  (): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter(
      (row) =>
        (path(pathToProp, row) as number) >=
        (typeof value === "number" ? value : (path(value, filters) as number))
    );

export const filterByPropertyEqualsFilter =
  <TFilters, TRow>(pathToProp: Path, filterProp?: keyof TFilters) =>
  (key: keyof TFilters): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter(
      (row) => path(pathToProp, row) === filters[filterProp ? filterProp : key]
    );

export const filterByPropertyEqualsValueInFilter =
  <TFilters, TRow>(pathToProp: Path, filterProp?: keyof TFilters) =>
  (key: keyof TFilters): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter((row) =>
      (filters[filterProp ? filterProp : key] as string[]).includes(
        path(pathToProp, row) as string
      )
    );

export const filterByDateRange =
  <TFilters, TRow>(datePath: Path, duration: DateRange) =>
  (): FilteringFunction<TFilters, TRow> =>
  (_, rows) =>
    rows.filter((row) => {
      const date = path(datePath, row) as Date;
      const { start, end } = duration;

      if (start && end) return isAfter(date, start) && isBefore(date, end);
      else if (!start && end) return isBefore(date, end);
      else if (!end && start)
        return isAfter(date, start) || isSameDay(date, start);
    });

export const filterByArrayItemInContextMatchesRow =
  <TFilters, TRow, TContext>(
    pathToRowProp: Path,
    arrayInContext: keyof TContext,
    pathToPropInArrayItem: Path
  ) =>
  (): FilteringFunction<TFilters, TRow, TContext> =>
  (_, rows, context) =>
    rows.filter((row) => {
      const rowProp = path(pathToRowProp, row);
      const array = context![arrayInContext] as unknown[];
      return array.find(
        (item) => path(pathToPropInArrayItem, item) === rowProp
      );
    });

export const filterByPropInContextMatchesRow =
  <TFilters, TRow, TContext>(pathToRowProp: Path, pathToContextProp: Path) =>
  (): FilteringFunction<TFilters, TRow, TContext> =>
  (_, rows, context) =>
    rows.filter(
      (row) => path(pathToRowProp, row) === path(pathToContextProp, context)
    );

/**
 * These two helpers are necessary until a date range form input is implemented
 */
export const filterByAfterDate =
  <TFilters, TRow>(datePath: Path, filterProp?: keyof TFilters) =>
  (key: keyof TFilters): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter((row) => {
      const dateValue = path(datePath, row);
      if (!datePath || !row || dateValue === undefined) return false;

      const date =
        dateValue instanceof Date
          ? dateValue
          : parseDateString(path(datePath, row)!);
      if (!date) return false;

      const filterDate = filters[filterProp ? filterProp : key] as Date;

      return isAfter(date, filterDate) || isSameDay(date, filterDate);
    });

export const filterByBeforeDate =
  <TFilters, TRow>(datePath: Path, filterProp?: keyof TFilters) =>
  (key: keyof TFilters): FilteringFunction<TFilters, TRow> =>
  (filters, rows) =>
    rows.filter((row) => {
      const dateValue = path(datePath, row);
      if (!datePath || !row || dateValue === undefined) return false;

      const date =
        dateValue instanceof Date
          ? dateValue
          : parseDateString(path(datePath, row)!);
      if (!date) return false;

      const filterDate = filters[filterProp ? filterProp : key] as Date;

      return isBefore(date, filterDate) || isSameDay(date, filterDate);
    });

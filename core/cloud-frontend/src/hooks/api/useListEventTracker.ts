import { HTTPValidationError } from "@/api/types";
import { ErrorType } from "@/api/mutator/custom-instance";
import { customInstance } from "@/api/mutator/custom-instance";
import { CompanyListRequest } from "@/api/types/companyListRequest";
import {
  getListEventTrackerQueryOptions,
  listEventTracker,
} from "@/api/endpoints/event-tracker/event-tracker";
import {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const getListEventTrackerCustomQueryKey = () => {
  return [`/api/dev/event-tracker/list`] as const;
};

export function useListEventTracker<
  TData = Awaited<ReturnType<typeof listEventTracker>>,
  TError = ErrorType<HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listEventTracker>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listEventTracker>>,
          TError,
          Awaited<ReturnType<typeof listEventTracker>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customInstance>;
  }
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListEventTracker<
  TData = Awaited<ReturnType<typeof listEventTracker>>,
  TError = ErrorType<HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listEventTracker>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listEventTracker>>,
          TError,
          Awaited<ReturnType<typeof listEventTracker>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListEventTracker<
  TData = Awaited<ReturnType<typeof listEventTracker>>,
  TError = ErrorType<HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listEventTracker>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary List Event Tracker
 */

export function useListEventTracker<
  TData = Awaited<ReturnType<typeof listEventTracker>>,
  TError = ErrorType<HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listEventTracker>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListEventTrackerQueryOptions<TData, TError>(
    companyListRequest,
    undefined,
    {
      ...options,
      query: {
        ...options?.query,
        queryKey: [...getListEventTrackerCustomQueryKey(), companyListRequest],
      },
    }
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

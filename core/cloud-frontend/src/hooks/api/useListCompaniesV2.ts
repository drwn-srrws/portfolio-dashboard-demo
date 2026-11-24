import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  getListCompaniesV2QueryOptions,
  listCompaniesV2,
} from "@/api/endpoints/company/company";
import {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { CompanyListRequest } from "@/api/types/companyListRequest";
import { ErrorType } from "@/api/mutator/custom-instance";
import { customInstance } from "@/api/mutator/custom-instance";
import { HTTPError } from "@/api/types/hTTPError";
import { HTTPValidationError } from "@/api/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const getListCompaniesV2CustomQueryKey = () => {
  return [`/api/dev/v2/company/list`] as const;
};

export function useListCompaniesV2<
  TData = Awaited<ReturnType<typeof listCompaniesV2>>,
  TError = ErrorType<HTTPError | HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listCompaniesV2>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCompaniesV2>>,
          TError,
          Awaited<ReturnType<typeof listCompaniesV2>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customInstance>;
  }
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useListCompaniesV2<
  TData = Awaited<ReturnType<typeof listCompaniesV2>>,
  TError = ErrorType<HTTPError | HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listCompaniesV2>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCompaniesV2>>,
          TError,
          Awaited<ReturnType<typeof listCompaniesV2>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useListCompaniesV2<
  TData = Awaited<ReturnType<typeof listCompaniesV2>>,
  TError = ErrorType<HTTPError | HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listCompaniesV2>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary List Companies V2
 */

export function useListCompaniesV2<
  TData = Awaited<ReturnType<typeof listCompaniesV2>>,
  TError = ErrorType<HTTPError | HTTPValidationError>,
>(
  companyListRequest: CompanyListRequest,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listCompaniesV2>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getListCompaniesV2QueryOptions(
    companyListRequest,
    undefined,
    {
      ...options,
      query: {
        ...options?.query,
        queryKey: [...getListCompaniesV2CustomQueryKey(), companyListRequest],
      },
    }
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  return query;
}

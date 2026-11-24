import { QueryClient } from "@tanstack/react-query";
import { F } from "ramda";

import {
  createDownsidePriceTarget,
  createPriceTarget,
  getReadCompanyQueryKey,
} from "@api/endpoints/company/company";
import { getReadEventsQueryKey } from "@api/endpoints/event/event";
import { getReadEventTrackerQueryKey } from "@api/endpoints/event-tracker/event-tracker";
import {
  CompanyPriceTargetResponse,
  LegacyCompanyResponse,
  UserResponse,
} from "@api/types/index";
import { EditableFieldProps } from "@components/ui/field/editable-field";
import { hyphenatedDate } from "@/utils/dates";
import { insertAtIndex } from "@/utils/lists";

import { createColumns } from "./utils";

const createPostBody = (companyId: number, value: number) => ({
  path: { id: companyId },
  body: {
    price_target_usd: value,
  },
});

const saveUpsidePriceTarget = (companyId: number, value: number) => {
  const body = createPostBody(companyId, value);
  return createPriceTarget(companyId, body.body);
};
const saveDownsidePriceTarget = (companyId: number, value: number) => {
  const body = createPostBody(companyId, value);
  return createDownsidePriceTarget(companyId, body.body);
};

export const onSaveOfEditingPriceTargets = (
  rows: EditableFieldProps[][],
  company: LegacyCompanyResponse,
  values: EditableFieldProps[],
  index: number,
  setRows: (rows: EditableFieldProps[][]) => void,
  queryClient: QueryClient
) => {
  if (
    values[1].value === rows[index][1].value &&
    values[2].value === rows[index][2].value
  ) {
    return;
  }

  const companyId = company.id;

  const requestsToMake = [];
  if (values[1].value !== rows[index][1].value) {
    const upsideRequest = saveUpsidePriceTarget(
      companyId,
      parseFloat(values[1].value as string)
    );

    requestsToMake.push(upsideRequest);
  } else requestsToMake.push(undefined);
  if (values[2].value !== rows[index][2].value) {
    const downsideRequest = saveDownsidePriceTarget(
      companyId,
      parseFloat(values[2].value as string)
    );

    requestsToMake.push(downsideRequest);
  }

  Promise.all(requestsToMake)
    .then(([upside, downside]) => {
      const newRows = [...rows];
      if (upside) {
        const value = upside.price_target_usd;
        newRows[index][1].value = value;
      }
      if (downside) {
        const downsideValue = downside.price_target_usd;
        newRows[index][2].value = downsideValue;
      }

      if (upside || downside) {
        const date = hyphenatedDate(new Date());
        newRows[index][3].value = date;

        setRows(newRows);
      }

      queryClient.invalidateQueries({
        queryKey: getReadEventsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getReadEventTrackerQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getReadCompanyQueryKey(companyId),
      });
    })
    .catch(() => {
      const newRows = [...rows];
      newRows[index][1].value = rows[index][1].value;
      newRows[index][2].value = rows[index][2].value;

      setRows(newRows);
    });
};

const getUpsideAndDownsideValues = (
  existingUpside: number,
  existingDownside: number,
  upsideData?: CompanyPriceTargetResponse,
  downsideData?: CompanyPriceTargetResponse
) => {
  let upside;
  let downside;

  if (upsideData) upside = upsideData.price_target_usd;
  else if (existingUpside) upside = existingUpside;
  else upside = "";

  if (downsideData) downside = downsideData.price_target_usd;
  else if (existingDownside) downside = existingDownside;
  else downside = "";

  let date = "";
  if (upside || downside) date = hyphenatedDate(new Date());

  return { upside, downside, date };
};

export const onSaveOfNewPriceTargets = (
  rows: EditableFieldProps[][],
  company: LegacyCompanyResponse,
  setRows: (rows: EditableFieldProps[][]) => void,
  setIsEditable: (isEditable: boolean[]) => void,
  newValues: [number?, number?],
  setIsCreatingAPriceTarget: (isCreatingAPriceTarget: boolean) => void,
  setUserHasExistingRow: (userHasExistingRow: boolean) => void,
  account: UserResponse,
  queryClient: QueryClient
) => {
  let newRows = [...rows];
  const index = rows.findIndex((row) => row[0].id === account.id);

  const existingUpside = parseFloat(rows[index]?.[1]?.value as string);
  const newUpsideEqualExistingUpside =
    index > -1 && newValues[0] === existingUpside;
  const existingDownside = parseFloat(rows[index]?.[2]?.value as string);
  const newDownsideEqualExistingDownside =
    index - 1 && newValues[1] === existingDownside;

  const upsideRequest =
    !newUpsideEqualExistingUpside && newValues[0]
      ? saveUpsidePriceTarget(company.id, newValues[0]!)
      : undefined;
  const downsideRequest =
    !newDownsideEqualExistingDownside && newValues[1]
      ? saveDownsidePriceTarget(company.id, newValues[1]!)
      : undefined;

  const requestsToMake = [];
  if (newValues[0] !== undefined) requestsToMake.push(upsideRequest);
  else requestsToMake.push(undefined);
  if (newValues[1] !== undefined) requestsToMake.push(downsideRequest);

  Promise.all(requestsToMake)
    .then(([upsideData, downsideData]) => {
      if (!upsideData && !downsideData) return;

      const { date, upside, downside } = getUpsideAndDownsideValues(
        existingUpside,
        existingDownside,
        upsideData,
        downsideData
      );

      const newRow = createColumns(account, date, {
        mostRecentPriceTarget: {
          priceTarget: upside as number,
          lastUpdated: date,
        },
        mostRecentDownsidePriceTarget: {
          priceTarget: downside as number,
          lastUpdated: date,
        },
      }) as EditableFieldProps[];

      if (index > -1) newRows = insertAtIndex(newRows, index, newRow);
      else {
        newRows = [newRow, ...newRows];
        setIsEditable([true, ...newRows.map(F)]);
      }

      setRows(newRows);
      setUserHasExistingRow(true);
      setIsCreatingAPriceTarget(false);

      queryClient.invalidateQueries({
        queryKey: getReadEventsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getReadEventTrackerQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getReadCompanyQueryKey(company.id),
      });
    })
    .catch(() => {
      setRows(rows);
    });
};

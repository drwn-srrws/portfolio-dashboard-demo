import {
  CompanyPriceTargetResponse,
  CompanyWithPriceTargetsResponse,
  UserResponse,
} from "@api/types/index";
import { Avatar } from "@/components/Avatar";
import { numToDollar } from "@/utils/currency";

type PriceTarget = {
  priceTarget: number;
  lastUpdated: string;
};

type CurrentPriceTargets = {
  mostRecentPriceTarget?: PriceTarget;
  mostRecentDownsidePriceTarget?: PriceTarget;
};

export const createColumns = (
  user: UserResponse,
  date: string,
  priceTargets: CurrentPriceTargets
) => {
  const upside = priceTargets.mostRecentPriceTarget?.priceTarget;
  const downside = priceTargets.mostRecentDownsidePriceTarget?.priceTarget;
  const id = user.id;

  return [
    {
      value: <Avatar data={user} />,
      id,
    },
    {
      value: upside,
      isFieldEditable: true,
      inputProps: {
        step: ".01",
        type: "number",
        className: "w-28 h-8 mt-0.5 text-md",
      },
      formattingFunction: numToDollar,
    },
    {
      value: downside,
      isFieldEditable: true,
      inputProps: {
        step: ".01",
        type: "number",
        className: "w-28 h-8 mt-0.5 text-md",
      },
      formattingFunction: numToDollar,
    },
    {
      value: date,
    },
  ];
};

const getMostRecentPriceTarget = (
  userId: number,
  priceTargets: CompanyPriceTargetResponse[]
): PriceTarget | undefined => {
  const priceTargetsForUser = priceTargets.filter(
    (pt) => pt.created_by.id === userId
  );

  const mostRecentPriceTarget = priceTargetsForUser.sort(
    (a, b) =>
      new Date(b.created_at_utc).getTime() -
      new Date(a.created_at_utc).getTime()
  )[0];

  if (!mostRecentPriceTarget) return undefined;

  const lastUpdated = mostRecentPriceTarget.created_at_utc;
  const priceTarget = mostRecentPriceTarget.price_target_usd;

  return { priceTarget, lastUpdated };
};

const mostRecentPriceTargetFoundForUser = (
  company: CompanyWithPriceTargetsResponse,
  userId: number
) => {
  const mostRecentPriceTarget = getMostRecentPriceTarget(
    userId,
    company.price_targets
  );
  const mostRecentDownsidePriceTarget = getMostRecentPriceTarget(
    userId,
    company.downside_price_targets
  );

  const result: { [key: string]: PriceTarget } = {};

  if (mostRecentPriceTarget)
    result.mostRecentPriceTarget = mostRecentPriceTarget;
  if (mostRecentDownsidePriceTarget)
    result.mostRecentDownsidePriceTarget = mostRecentDownsidePriceTarget;

  return result;
};

export const getMostRecentPriceTargetForEachUser = (
  company: CompanyWithPriceTargetsResponse
) => {
  const uniqueUsers = new Map<number, UserResponse>();
  company.price_targets.forEach((pt) => {
    uniqueUsers.set(pt.created_by.id, pt.created_by);
  });
  company.downside_price_targets.forEach((pt) => {
    uniqueUsers.set(pt.created_by.id, pt.created_by);
  });

  const eachUsersMostRecentPriceTargets: Map<
    UserResponse,
    CurrentPriceTargets
  > = new Map();

  uniqueUsers.forEach((user) => {
    const mostRecentPriceTarget = mostRecentPriceTargetFoundForUser(
      company,
      user.id
    );
    eachUsersMostRecentPriceTargets.set(user, mostRecentPriceTarget);
  });

  return eachUsersMostRecentPriceTargets;
};

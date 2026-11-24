import { PatchCompanyCoverageMutationResult } from "@api/endpoints/company/company";

import { hyphenatedDate } from "@/utils/index";

import { CoverageType } from "@/api/types";

export const addOneDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

export const subtractOneDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - 1);
  return newDate;
};

export const convertCoverageRowToModel = ({
  coverageId,
  companyId,
  userId,
  coverageType,
  effectiveStartDate,
  effectiveEndDate,
}: {
  coverageId?: number;
  companyId: number;
  userId: number;
  coverageType: CoverageType;
  effectiveStartDate: Date;
  effectiveEndDate?: Date;
}): PatchCompanyCoverageMutationResult => ({
  id: coverageId!,
  company_id: companyId,
  user_id: userId,
  coverage_type: coverageType,
  effective_start_date: hyphenatedDate(effectiveStartDate),
  effective_end_date: effectiveEndDate
    ? hyphenatedDate(addOneDay(effectiveEndDate))
    : null,
});

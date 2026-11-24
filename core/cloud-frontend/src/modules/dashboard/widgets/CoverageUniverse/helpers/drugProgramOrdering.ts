import { DrugResponse } from "@api/types";

const UNKNOWN_STAGE_ORDER = 999;

export const DEVELOPMENT_STAGE_ORDER: Record<string, number> = {
  Approved: 0,
  "Approved (Generic Competition)": 1,
  "Approved in Europe": 2,
  "Approved in other than U.S./E.U.": 3,
  Launched: 4,
  BLA: 5,
  NDA: 6,
  Registered: 7,
  III: 8,
  "Phase III Clinical Trial": 9,
  "II/III": 10,
  II: 11,
  "Phase II Clinical Trial": 12,
  "I/II": 13,
  IIb: 14,
  I: 15,
  "Phase I Clinical Trial": 16,
  "Investigator Initiated": 17,
  IND: 18,
  "Program Hold": 19,
  Development: 20,
  "Development Outside U.S.": 21,
  Preclinical: 22,
  "Pre-registration": 23,
  Suspended: 24,
  Withdrawn: 25,
  "Withdrawn from Market": 26,
  Discontinued: 27,
  "No Development Reported": 28,
  "Not Applicable": 29,
};

export const getDevelopmentStageOrder = (stage?: string | null): number =>
  stage != null && stage in DEVELOPMENT_STAGE_ORDER
    ? DEVELOPMENT_STAGE_ORDER[stage]
    : UNKNOWN_STAGE_ORDER;

export const sortByDevelopmentStage = (drugs: DrugResponse[]): DrugResponse[] =>
  drugs
    .slice()
    .sort(
      (a, b) =>
        getDevelopmentStageOrder(a.development_stage) -
        getDevelopmentStageOrder(b.development_stage)
    );

import {
  CompanyResponse as Company,
  CompanyResponseWeightedAttributes,
  DrugResponse,
} from "@api/types";
import { PriceUpdate } from "@/typings/RealtimePricing";
import { Time } from "lightweight-charts";
import { sortByDevelopmentStage } from "./drugProgramOrdering";

export interface CompanyRow
  extends Omit<
    Company,
    "position_exposure_by_funds" | "position_ytd_pnl_by_funds"
  > {
  path: string[];
  development_stage?: string;
  modality?: string;
  disease_area?: string;
  moa?: string;
  weighted_attributes: CompanyResponseWeightedAttributes;
  children: DrugProgramRow[];
  in_portfolio?: boolean | null;
  realtimePriceHistory?: PriceUpdate[];
  dtd_price_curve?: [Time, number][];
  position_exposure_by_funds?: Array<{
    fund: { name: string; id: number };
    exposure: number | null;
  }>;
  position_ytd_pnl_by_funds?: Array<{
    fund: { name: string };
    ytd_pnl_percent_nav: number | null;
  }>;
  pitchbook_profile?: {
    pitchbook_id?: string | null;
    total_raised?: number | null;
    last_round_date?: string | null;
    last_round_year?: number | null;
    years_since_last_round?: number | null;
    business_status?: string | null;
  } | null;
  // True when market_cap_bbg is the Pitchbook last-known-valuation fallback
  // rather than a Bloomberg market cap (rendered with a trailing asterisk).
  market_cap_bbg_is_estimated?: boolean | null;
}

export interface DrugProgramRow {
  path: string[];
  name?: string | null;
  molecule_type?: string | null;
  therapeutic_areas?: string;
  indications?: string;
  mechanism_of_action?: string | null;
  drug_type?: string | null;
  development_stage?: string | null;
  weight?: number | null;
}

export const mapDrugProgramToRow = (
  companyId: number,
  index: number,
  drug: DrugResponse
): DrugProgramRow => ({
  path: [companyId.toString(), `${index}-${drug.name}`],
  name: drug.name,
  molecule_type: drug.molecule_type,
  therapeutic_areas: (drug.therapeutic_areas ?? [])
    .map((ta) => ta.name)
    .join(", "),
  indications: (drug.indications ?? []).map((ind) => ind.name).join(", "),
  mechanism_of_action: drug.mechanism_of_action,
  drug_type: drug.drug_type,
  development_stage: drug.development_stage,
  weight: drug.weight ?? null,
});

export const mapCompaniesToRows = (companies: Company[]): CompanyRow[] => {
  return companies.flatMap((company) => {
    const drugs = sortByDevelopmentStage(company.drugs ?? []);

    const safeWeightedAttributes: CompanyResponseWeightedAttributes =
      company.weighted_attributes || {};

    const companyRow: CompanyRow = {
      ...company,
      path: [company.id.toString()],
      position_exposure_by_funds: company.position_exposure_by_funds || [],
      position_ytd_pnl_by_funds: company.position_ytd_pnl_by_funds || [],
      weighted_attributes: safeWeightedAttributes,
      children: drugs.map((drug, index) =>
        mapDrugProgramToRow(company.id, index, drug)
      ),
    };

    return [companyRow];
  });
};

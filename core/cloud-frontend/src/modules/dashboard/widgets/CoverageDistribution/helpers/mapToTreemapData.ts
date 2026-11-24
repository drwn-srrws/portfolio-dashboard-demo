import { CompanyResponse as Company } from "@api/types";
import { TreemapNode } from "../components/Treemap";

export const mapToTreemapData = (
  metric: string,
  company: Company
): TreemapNode => ({
  id: company.id,
  name: company.name,
  value: company[metric as keyof Company] as number,
});

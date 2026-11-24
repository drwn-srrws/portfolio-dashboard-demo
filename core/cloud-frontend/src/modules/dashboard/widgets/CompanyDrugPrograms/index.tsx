import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { useCompanyPageData } from "@/hooks/api/useCompanyPageData";

import Card from "../Card/Card";
import {
  createDrugProgramColumnDefs,
  defaultDrugProgramColDef,
} from "../CoverageUniverse/constants/columnDefs";
import {
  DrugProgramRow,
  mapDrugProgramToRow,
} from "../CoverageUniverse/helpers/mapCompaniesToRows";
import { sortByDevelopmentStage } from "../CoverageUniverse/helpers/drugProgramOrdering";

const CompanyDrugProgramsContent = () => {
  const params = useParams();
  const { companyId } = params;

  const { companyData, isLoading } = useCompanyPageData(Number(companyId), {
    includeDrugs: true,
  });

  const columnDefs = useMemo(() => createDrugProgramColumnDefs(), []);

  const rowData = useMemo<DrugProgramRow[]>(() => {
    const drugs = sortByDevelopmentStage(companyData?.drugs ?? []);
    return drugs.map((drug, index) =>
      mapDrugProgramToRow(companyData?.id ?? 0, index, drug)
    );
  }, [companyData?.drugs, companyData?.id]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: "normal",
    }),
    []
  );

  const isEmpty = !isLoading && rowData.length === 0;
  const cardTitle = isLoading
    ? "Drug Programs"
    : `Drug Programs (${rowData.length})`;

  return (
    <Card title={cardTitle} className="w-full min-w-full">
      {isEmpty ? (
        <div className="flex size-full flex-1 flex-col justify-center gap-5">
          <NoDataOverlay title="No KG data available" description="" />
        </div>
      ) : (
        <div className="flex-1">
          <DataGrid
            layout={dataGridLayout}
            rowData={rowData}
            columnDefs={columnDefs}
            loading={isLoading}
            defaultColDef={defaultDrugProgramColDef}
            getRowId={(row) => row.path.join(".")}
          />
        </div>
      )}
    </Card>
  );
};

export const CompanyDrugPrograms = withAppInsights(
  CompanyDrugProgramsContent,
  "CompanyDrugPrograms"
);

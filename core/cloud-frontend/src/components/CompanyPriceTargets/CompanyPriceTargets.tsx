import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { useReadCompanyWithPriceTargets } from "@api/endpoints/company/company";
import { CompanyPriceTargetResponse } from "@api/types/index";
import { useCompanyPriceTargets } from "@/providers/CompanyPriceTargetsProvider/useCompanyPriceTargets";
import {
  EditableFieldGroups,
  EditableFieldProps,
} from "@components/ui/field/editable-field";
import { hyphenatedDate, parseDateString } from "@/utils/dates";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useCoverages } from "@/providers/CoveragesProvider/useCoverages";

import { Button, Sheet, SheetContent, SheetTitle } from "@components/ui";
import { NewPriceTargetForm } from "./NewPriceTargetForm";
import {
  onSaveOfEditingPriceTargets,
  onSaveOfNewPriceTargets,
} from "./saving-utils";
import { createColumns, getMostRecentPriceTargetForEachUser } from "./utils";

const editableFieldGroupLabels = [
  "",
  "Upside PT ($/shr)",
  "Downside PT ($/shr)",
  "Last Updated",
  "",
];

export const CompanyPriceTargets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingAPriceTarget, setIsCreatingAPriceTarget] = useState(false);
  const [rows, setRows] = useState<EditableFieldProps[][]>([]);
  const [isEditable, setIsEditable] = useState<boolean[]>([]);
  const { canUserCreateAPriceTargetForThisCompany } = useCoverages();
  const { account } = useAuth();
  const { companyId, setCompanyId } = useCompanyPriceTargets();
  const [userHasExistingRow, setUserHasExistingRow] = useState(false);

  const { data } = useReadCompanyWithPriceTargets(companyId as number, {
    query: {
      enabled: !!companyId,
    },
  });

  const updatedCompany = data;
  const queryClient = useQueryClient();

  useEffect(() => {
    const findUserWithinPriceTargets = (
      priceTargets: CompanyPriceTargetResponse[]
    ) =>
      priceTargets.find(
        (priceTarget) => priceTarget.created_by.id === account!.id
      );

    if (updatedCompany && !!account?.id) {
      let foundUser = false;

      const upsidePriceTargets = updatedCompany.price_targets;
      if (upsidePriceTargets?.length > 0)
        foundUser = !!findUserWithinPriceTargets(upsidePriceTargets);

      const downsidePriceTargets = updatedCompany.downside_price_targets;
      if (downsidePriceTargets?.length > 0 && !foundUser)
        foundUser = !!findUserWithinPriceTargets(downsidePriceTargets);

      if (foundUser) {
        setUserHasExistingRow(true);
        return;
      }
    }
  }, [account, updatedCompany]);

  useEffect(() => {
    if (companyId) setIsOpen(true);
    else {
      setIsOpen(false);
      setUserHasExistingRow(false);
    }
  }, [companyId]);

  const showCreatePriceTargetButton = useMemo(() => {
    if (!updatedCompany || !account) return;

    const userIsAllowedToCreatePriceTargets =
      canUserCreateAPriceTargetForThisCompany(updatedCompany.id, account);

    return userIsAllowedToCreatePriceTargets && !userHasExistingRow;
  }, [
    updatedCompany,
    account,
    userHasExistingRow,
    canUserCreateAPriceTargetForThisCompany,
  ]);

  useEffect(() => {
    const rowData: EditableFieldProps[][] = [];
    const isRowEditable: boolean[] = [];
    const eachUsersMostRecentPriceTargets = updatedCompany
      ? getMostRecentPriceTargetForEachUser(updatedCompany)
      : new Map();

    eachUsersMostRecentPriceTargets.forEach((priceTargets, user) => {
      const isThisRowEditable = !!account && account.id === user.id;
      isRowEditable.push(isThisRowEditable);

      const dateValue =
        priceTargets.mostRecentPriceTarget?.lastUpdated ||
        priceTargets.mostRecentDownsidePriceTarget?.lastUpdated;
      let date = "";
      if (dateValue) date = hyphenatedDate(parseDateString(dateValue)!);

      const row = createColumns(
        user,
        date,
        priceTargets
      ) as EditableFieldProps[];
      rowData.push(row);
    });

    setIsEditable(isRowEditable);
    setRows(rowData);
  }, [
    companyId,
    canUserCreateAPriceTargetForThisCompany,
    updatedCompany,
    account,
  ]);

  const gridColumns = "1fr 3fr 3fr 3fr 3fr";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setCompanyId(null);
      }}
    >
      <VisuallyHidden.Root asChild>
        <SheetTitle>
          Price Targets for {updatedCompany?.display_name}
        </SheetTitle>
      </VisuallyHidden.Root>
      <SheetContent className="w-full !max-w-3xl overflow-y-scroll">
        <section className="max-w-4xl">
          <p className="font-semibold">
            Viewing price targets for:{" "}
            <span className="font-semibold">
              {updatedCompany?.display_name}
            </span>
          </p>

          <section className="py-8">
            {rows?.length > 0 ? (
              <EditableFieldGroups
                fields={rows}
                isRowEditable={isEditable}
                labels={editableFieldGroupLabels}
                onChange={(newValues, index) => {
                  if (!updatedCompany) return;
                  onSaveOfEditingPriceTargets(
                    rows,
                    updatedCompany,
                    newValues,
                    index,
                    setRows,
                    queryClient
                  );
                }}
                gridColumns={gridColumns}
              />
            ) : (
              <p className="py-8">
                No Price Targets were found for this company!
              </p>
            )}
          </section>
          {showCreatePriceTargetButton && (
            <div className="flex justify-end">
              {isCreatingAPriceTarget ? (
                <NewPriceTargetForm
                  onCancel={() => setIsCreatingAPriceTarget(false)}
                  onSave={(newValues) => {
                    if (!updatedCompany) return;

                    onSaveOfNewPriceTargets(
                      rows,
                      updatedCompany,
                      setRows,
                      setIsEditable,
                      newValues,
                      setIsCreatingAPriceTarget,
                      setUserHasExistingRow,
                      account!,
                      queryClient
                    );
                  }}
                />
              ) : (
                <Button
                  className="mt-1 h-10"
                  onClick={() => setIsCreatingAPriceTarget(true)}
                  data-testid="create-price-target-button"
                >
                  Create a new Price Target
                </Button>
              )}
            </div>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
};

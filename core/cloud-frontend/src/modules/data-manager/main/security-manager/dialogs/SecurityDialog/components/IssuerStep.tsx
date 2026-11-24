import { InstrumentResponse } from "@/api/types";

import { useStore } from "@/store";
import { useGetInstrument } from "@/api/endpoints/instrument/instrument";

import { Loader } from "@/components/Loader";
import { IssuerForm } from "./IssuerForm";
import { editIssuerSchema } from "../editIssuerSchema";

export const IssuerStep = ({
  onClose,
  onForward,
}: {
  onClose: () => void;
  onForward: () => void;
}) => {
  const { prefilled } = useStore();
  const instrumentId = (
    prefilled as {
      data: InstrumentResponse;
    }
  )?.data?.id;

  const { data: defaultValues, isLoading: isLoadingInstrument } =
    useGetInstrument(instrumentId, {
      query: {
        enabled: !!instrumentId,
      },
    });

  if (isLoadingInstrument) return <Loader />;
  if (!defaultValues) return null;

  return (
    <IssuerForm
      data={{
        company: defaultValues.issuer
          ? {
              value: String(defaultValues.issuer?.id || ""),
              label: defaultValues.issuer?.name ?? "",
            }
          : null,
      }}
      schema={editIssuerSchema}
      onClose={onClose}
      onForward={onForward}
      instrumentId={instrumentId}
    />
  );
};

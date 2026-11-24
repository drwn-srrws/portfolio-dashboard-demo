import { AssetClass, InstrumentResponse } from "@/api/types";

import { SecurityForm } from "./SecurityForm";
import { useStore } from "@/store";
import {
  useGetInstrument,
  useGetAssetClassConfig,
} from "@/api/endpoints/instrument/instrument";
import { useMemo } from "react";
import {
  addConfigFieldsToDefaultValues,
  addConfigFieldsToSchema,
} from "../../../lib/generateSchema";
import { editSecuritySchema } from "../editSecuritySchema";
import { Loader } from "@/components/Loader";
import { capitalize } from "@/utils/strings";
export const SecurityStep = ({
  onClose,
  onForward,
  onBackward,
}: {
  onClose: () => void;
  onForward: () => void;
  onBackward: () => void;
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

  const { data: assetClassConfig, isLoading: isLoadingAssetClassConfig } =
    useGetAssetClassConfig(defaultValues?.asset_class as AssetClass, {
      query: {
        enabled: !!defaultValues?.asset_class,
      },
    });

  const { data, schema } = useMemo(() => {
    if (!assetClassConfig || !defaultValues)
      return { data: null, schema: editSecuritySchema };

    return {
      data: addConfigFieldsToDefaultValues(assetClassConfig, defaultValues),
      schema: addConfigFieldsToSchema(editSecuritySchema, assetClassConfig),
    };
  }, [assetClassConfig, defaultValues]);

  const isLoading = isLoadingInstrument || isLoadingAssetClassConfig;

  if (isLoading) return <Loader />;
  if (!defaultValues) return null;

  return (
    <SecurityForm
      instrumentId={instrumentId}
      data={{
        name: defaultValues.name,
        asset_class: {
          label: capitalize(String(defaultValues.asset_class)),
          value: String(defaultValues.asset_class),
        },
        ...data,
      }}
      schema={schema}
      config={assetClassConfig}
      onClose={onClose}
      onForward={onForward}
      onBackward={onBackward}
    />
  );
};

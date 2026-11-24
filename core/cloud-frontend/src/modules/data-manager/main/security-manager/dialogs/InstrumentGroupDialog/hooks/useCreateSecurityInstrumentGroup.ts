import { CreateSecurityCompanyFormData } from "../schema";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  getGetInstrumentGroupsQueryKey,
  useCreateInstrumentGroup,
} from "@/api/endpoints/instrument-group/instrument-group";
import { CreateInstrumentGroup } from "@/api/types";
import { getGetInstrumentsQueryKey } from "@/api/endpoints/instrument/instrument";

export const useCreateSecurityInstrumentGroup = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: executeCreateInstrumentGroup,
    isPending: isCreatingInstrumentGroup,
  } = useCreateInstrumentGroup({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetInstrumentGroupsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetInstrumentsQueryKey(),
        });
      },
    },
  });

  const createInstrumentGroup = async (
    values: CreateSecurityCompanyFormData
  ) => {
    try {
      const { companyName, addSecurities } = values;

      const data: CreateInstrumentGroup = {
        name: companyName,
        instrument_ids: addSecurities.map((instrument) => instrument.id),
      };

      await executeCreateInstrumentGroup({ data });

      toast({
        title: "Instrument Group created successfully",
        variant: "primary",
      });
    } catch (error) {
      console.error("Error creating instrument group", error);
      toast({
        title: "Failed to create instrument group",
        variant: "destructive",
      });
    }
  };

  return { createInstrumentGroup, isCreatingInstrumentGroup };
};

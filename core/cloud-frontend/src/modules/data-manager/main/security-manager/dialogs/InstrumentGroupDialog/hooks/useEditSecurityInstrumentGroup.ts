import { CreateSecurityCompanyFormData } from "../schema";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateInstrumentGroup } from "@/api/endpoints/instrument-group/instrument-group";
import { toast } from "@/components/ui/use-toast";
import { getGetInstrumentGroupsQueryKey } from "@/api/endpoints/instrument-group/instrument-group";
import { UpdateInstrumentGroup } from "@/api/types";
import { getGetInstrumentsQueryKey } from "@/api/endpoints/instrument/instrument";

export const useEditSecurityInstrumentGroup = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: executeUpdateInstrumentGroup,
    isPending: isUpdatingInstrumentGroup,
  } = useUpdateInstrumentGroup({
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

  const updateInstrumentGroup = async (
    instrumentGroupId: number,
    values: CreateSecurityCompanyFormData
  ) => {
    try {
      const { companyName, addSecurities } = values;

      const data: UpdateInstrumentGroup = {
        name: companyName,
        instrument_ids: addSecurities.map((instrument) => instrument.id),
      };

      await executeUpdateInstrumentGroup({ groupId: instrumentGroupId, data });

      toast({
        title: "Instrument Group updated successfully",
        variant: "primary",
      });
    } catch {
      toast({
        title: "Failed to update instrument group",
        variant: "destructive",
      });
    }
  };

  return { updateInstrumentGroup, isUpdatingInstrumentGroup };
};

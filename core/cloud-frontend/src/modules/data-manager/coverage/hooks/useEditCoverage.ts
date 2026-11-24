import {
  getReadCompanyCoveragesQueryKey,
  usePatchCompanyCoverage,
} from "@/api/endpoints/company/company";
import { CompanyCoveragePatchRequest } from "@/api/types";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const useEditCoverage = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePatchCompanyCoverage();

  const editCoverage = (id: number, data: CompanyCoveragePatchRequest) => {
    return mutateAsync(
      { id, data },
      {
        onSuccess: () => {
          toast({ title: "Coverage updated!" });
          queryClient.invalidateQueries({
            queryKey: getReadCompanyCoveragesQueryKey(),
          });
        },
      }
    );
  };
  return { editCoverage, isLoading: isPending };
};

export default useEditCoverage;

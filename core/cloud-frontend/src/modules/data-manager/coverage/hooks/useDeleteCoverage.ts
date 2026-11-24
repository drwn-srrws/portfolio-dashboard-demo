import {
  getReadCompanyCoveragesQueryKey,
  useDeleteCompanyCoverage,
} from "@/api/endpoints/company/company";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
const useDeleteCoverage = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useDeleteCompanyCoverage();

  const deleteCoverage = (id: number) =>
    mutateAsync(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Coverage deleted",
          });
          queryClient.invalidateQueries({
            queryKey: getReadCompanyCoveragesQueryKey(),
          });
        },
      }
    );

  return { deleteCoverage, isLoading: isPending };
};

export default useDeleteCoverage;

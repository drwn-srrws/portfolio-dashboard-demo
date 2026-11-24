import { useCreateCompanyCoverage } from "@/api/endpoints/company/company";
import { CompanyCoveragePostRequest, HTTPError } from "@/api/types";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getReadCompanyCoveragesQueryKey } from "@/api/endpoints/company/company";
import { AxiosError } from "axios";
const useCreateCoverage = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useCreateCompanyCoverage();

  const createCoverage = (coverage: CompanyCoveragePostRequest) => {
    return mutateAsync(
      { data: coverage },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getReadCompanyCoveragesQueryKey(),
          });
          toast({
            title: "Coverage created successfully",
          });
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            title: "Error creating coverage",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        },
      }
    );
  };

  return { createCoverage, isLoading: isPending };
};

export default useCreateCoverage;

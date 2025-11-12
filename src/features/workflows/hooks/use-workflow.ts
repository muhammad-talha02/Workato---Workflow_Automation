import { useTRPC } from "@/trpc/client";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch all workflows using suspense

export const useSusupenseWorkflows = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflow.getMany.queryOptions());
};

// Create workflow

export const useCreatWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" created`);
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions());
      },
      onError: (error) => {
        toast.error(`Failed to create workflow. ${error.message}`);
      },
    })
  );
};

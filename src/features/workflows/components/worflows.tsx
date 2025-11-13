"use client";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useCreatWorkflow, useSusupenseWorkflows } from "../hooks/use-workflow";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
    delay: 500,
  });
  return (
    <EntitySearch
      value={searchValue}
      // value={params?.search}
      onChange={(value) => onSearchChange(value)}
      placeholder="Search worflows"
    />
  );
};

export const WorkflowsPagination = () => {
  const workflows = useSusupenseWorkflows();
  const [params, setParams] = useWorkflowsParams();
 
  
  return (
    <EntityPagination
      page={workflows?.data?.page}
      onPageChange={(value) => setParams({ page: value })}
      totalPages={workflows?.data?.totalPages}
      disabled={workflows?.isFetching}
    />
  );
};

export const WorflowsList = () => {
  const workflows = useSusupenseWorkflows();
  return (
    <div className="flex flex-1 justify-center items-center">
      <p>{JSON.stringify(workflows.data, null, 2)}</p>
    </div>
  );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreatWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Worflows"
        description="Create and manage your workflows"
        onNew={handleCreateWorkflow}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination/>}
    >
      {children}
    </EntityContainer>
  );
};

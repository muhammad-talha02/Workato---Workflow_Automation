"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useCreatWorkflow, useSusupenseWorkflows } from "../hooks/use-workflow";

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
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};

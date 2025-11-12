"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useSusupenseWorkflows } from "../hooks/use-workflow";
import { ReactNode } from "react";

export const WorflowsList = () => {
  const workflows = useSusupenseWorkflows();
  return <div>{JSON.stringify(workflows.data, null, 2)}</div>;
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Worflows"
        description="Create and manage your workflows"
        onNew={() => {}}
        newButtonLabel="New workflow"
        disabled={disabled}
        isCreating={false}
      />
    </>
  );
};

export const WorkflowsContainer = ({children}:{children:ReactNode})=>{
return (
    <EntityContainer
    header={<WorkflowHeader/>}
    search={<></>}
    pagination={<></>}
    >
        {children}
    </EntityContainer>
)
}

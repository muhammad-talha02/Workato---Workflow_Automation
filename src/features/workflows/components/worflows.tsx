"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import type { Workflow } from "@/generated/prisma/client";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useCreatWorkflow, useRemoveWorkflow, useSusupenseWorkflows } from "../hooks/use-workflow";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

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
      onPageChange={(value) => setParams({ ...params, page: value })}
      totalPages={workflows?.data?.totalPages}
      disabled={workflows?.isFetching}
    />
  );
};

export const WorflowsList = () => {
  const workflows = useSusupenseWorkflows();

  return (
    <EntityList
      items={workflows?.data?.items}
      getKey={(workflow) => workflow.id}
      renderItem={(item) => {
        return <WorkflowItem data={item}/>;
      }}
      emptyView={<WorkflowsEmpty />}
    />
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
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading workflows...." />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Error Loading workflows." />;
};

export const WorkflowsEmpty = () => {
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
      <EmptyView
        message="You haven't created any workflow yet. Get started by creating your first worflow"
        onNew={handleCreateWorkflow}
      />
    </>
  );
};

export const WorkflowItem = ({ data }: { data: Workflow }) => {

  const removeWorkflow = useRemoveWorkflow()
  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subTitle={<>Updated {formatDistanceToNow(data.updatedAt, {addSuffix:true})} &bull; Created {formatDistanceToNow(data.createdAt, {addSuffix:true})}</>}
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={()=>removeWorkflow.mutate({id:data?.id})}
      isRemoving={removeWorkflow.isPending}
    />
  );
};

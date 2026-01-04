"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  Execution,
  ExecutionStatus
} from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { useSusupenseExecutions } from "../hooks/use-execution";
import { useExecutionsParams } from "../hooks/use-execution-params";

export const ExecutionsPagination = () => {
  const executions = useSusupenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      page={executions?.data?.page}
      onPageChange={(value) => setParams({ ...params, page: value })}
      totalPages={executions?.data?.totalPages}
      disabled={executions?.isFetching}
    />
  );
};

export const ExecutionsList = () => {
  const executions = useSusupenseExecutions();

  return (
    <EntityList
      items={executions?.data?.items}
      getKey={(execution) => execution.id}
      renderItem={(item) => {
        return <ExecutionItem data={item} />;
      }}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Executions"
        description="View your workflow execution history"
        disabled={disabled}
      />
    </>
  );
};

export const ExecutionsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<ExecutionHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions...." />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error Loading Executions." />;
};

export const ExecutionsEmpty = () => {
  return (
    <>
      <EmptyView message="You haven't created any execution yet. Get started by creating your first workflow." />
    </>
  );
};

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
};
export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round(
       ( new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) / 1000
      )
    : null;

  const subTitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s</>}
    </>
  );
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.status?.charAt(0) + data.status.slice(1).toLowerCase()}
      subTitle={subTitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};

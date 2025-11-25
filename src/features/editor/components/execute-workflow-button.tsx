import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflow";
import { FlaskConicalIcon } from "lucide-react";
import React from "react";

const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const executeWorflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorflow.mutate({ id: workflowId });
  };
  return (
    <Button size={"lg"} onClick={handleExecute} disabled={executeWorflow.isPending}>
      <FlaskConicalIcon className="size-4" />
      Execute Workflow{" "}
    </Button>
  );
};

export default ExecuteWorkflowButton;

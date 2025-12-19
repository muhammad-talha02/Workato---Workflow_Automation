"use client";

import { InngestChannels } from "@/inngest/channels";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchHttpRequestRealTimeToken } from "./actions";
import GeminiDialog, { GEMINI_MODELS, GeminiFormValues } from "./dialog";

type GeminiNodeData = {
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData?.model || GEMINI_MODELS[0]}: ${nodeData.userPrompt.slice(0,50)}...`
    : "Not configured";
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: InngestChannels.httpRequestChannel,
    topic: "status",
    refreshToken: fetchHttpRequestRealTimeToken,
  });
console.log({nodeStatus})
  const handleSave = (values: GeminiFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={'/logos/gemini.svg'}
        name="Gemini"
        description={description}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        status={nodeStatus}
      />
      <GeminiDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSave}
        defaultValues={nodeData}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";

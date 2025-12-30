"use client";

import { InngestChannels } from "@/inngest/channels";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchSlackRealTimeToken } from "./actions";
import SlackDialog, { SlackFormValues } from "./dialog";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.content
    ? ` ${nodeData.content.slice(0,50)}...`
    : "Not configured";
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: InngestChannels.slackChannel,
    topic: "status",
    refreshToken: fetchSlackRealTimeToken,
  });

  const handleSave = (values: SlackFormValues) => {
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
        icon={'/logos/slack.svg'}
        name="Slack"
        description={description}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        status={nodeStatus}
      />
      <SlackDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSave}
        defaultValues={nodeData}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";

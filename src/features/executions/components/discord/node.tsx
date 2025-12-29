"use client";

import { InngestChannels } from "@/inngest/channels";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { BaseExecutionNode } from "../base-execution-node";
import { fetchDiscordRealTimeToken } from "./actions";
import DiscordDialog, { DiscordFormValues } from "./dialog";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.content
    ? ` ${nodeData.content.slice(0,50)}...`
    : "Not configured";
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: InngestChannels.discordChannel,
    topic: "status",
    refreshToken: fetchDiscordRealTimeToken,
  });

  const handleSave = (values: DiscordFormValues) => {
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
        icon={'/logos/discord.svg'}
        name="Discord"
        description={description}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        status={nodeStatus}
      />
      <DiscordDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSave}
        defaultValues={nodeData}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";

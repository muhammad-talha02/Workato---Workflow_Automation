"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import ManualTriggerDialog from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { InngestChannels } from "@/inngest/channels";
import { fetchManualTriggerRealTimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: InngestChannels.manualTriggerChannel,
    topic: "status",
    refreshToken: fetchManualTriggerRealTimeToken,
  });
  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        // onDoubleClick={()=>{}}
      />
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

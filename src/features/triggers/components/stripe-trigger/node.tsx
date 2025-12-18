"use client";

import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { InngestChannels } from "@/inngest/channels";
import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchStripeTriggerRealTimeToken } from "./actions";
import StripeTriggerDialog from "./dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: InngestChannels.stripeTriggerChannel,
    topic: "status",
    refreshToken: fetchStripeTriggerRealTimeToken,
  });  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={'/logos/stripe.svg'}
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        // onDoubleClick={()=>{}}
      />
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";

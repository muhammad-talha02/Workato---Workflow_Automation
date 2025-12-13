"use client";

import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { InngestChannels } from "@/inngest/channels";
import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchGoogleFormTriggerRealTimeToken } from "./actions";
import GoogleFormTriggerDialog from "./dialog";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: InngestChannels.googleFormTriggerChannel,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealTimeToken,
  });  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={'/logos/googleform.svg'}
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        // onDoubleClick={()=>{}}
      />
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

GoogleFormTrigger.displayName = "GoogleFormTrigger";

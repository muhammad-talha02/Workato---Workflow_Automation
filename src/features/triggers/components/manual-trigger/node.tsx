"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
 
  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        // status={NodeStatus}
        // onSettings={()=>{}}
        // onDoubleClick={()=>{}}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

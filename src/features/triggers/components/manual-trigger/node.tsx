"use client";

import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import ManualTriggerDialog from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={'initial'}
        onSettings={()=>setOpen(true)}
        onDoubleClick={()=>setOpen(true)}
        // onDoubleClick={()=>{}}
      />
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import WorkflowNode from "../../../components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
  //   status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}
export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    //   status,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const handleDelete = () => {};

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
          <BaseNodeContent>
            {typeof Icon === "string" ? (
              <Image src={Icon} width={16} height={16} alt={name} />
            ) : (
              <Icon className="size-4 text-muted-foreground" />
            )}
            {children}
            <BaseHandle
              id={"source-1"}
              type="source"
              position={Position.Right}
            />
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";

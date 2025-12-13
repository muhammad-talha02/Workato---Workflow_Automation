"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import {
  BaseNode,
  BaseNodeContent,
} from "../../../components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import WorkflowNode from "../../../components/workflow-node";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import { cn } from "@/lib/utils";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: ReactNode;
    status?: NodeStatus;
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
      status='loading',
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
      setNodes((currenNodes) => {
        const updatedNodes = currenNodes.filter((node) => node.id !== id);
        return updatedNodes;
      });

      setEdges((currenEdges) => {
        const updatedEdges = currenEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        return updatedEdges;
      });
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <NodeStatusIndicator status={status} variant="border" className="rounded-[6px] rounded-l-2xl">
          <BaseNode
            onDoubleClick={onDoubleClick}
            className={cn("relative group","rounded-l-2xl")}
            status={status}
          >
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
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";

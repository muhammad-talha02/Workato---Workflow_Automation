"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import HTTPRequestDialog, { HTTPRequestFormValues } from "./dialog";

type HttpRequestNodeData = {
  variableName?:string
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData?.method || "GET"}: ${nodeData.endpoint}`
    : "not configured";
  const [open, setOpen] = useState(false);
  const { setNodes } = useReactFlow();
  
  const handleSave = (values: HTTPRequestFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values
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
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={() => setOpen(true)}
        onDoubleClick={() => setOpen(true)}
        status={"initial"}
      />
      <HTTPRequestDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSave}
        defaultValues={nodeData}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";

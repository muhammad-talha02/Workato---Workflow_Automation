"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSusupenseWorkflow } from "@/features/workflows/hooks/use-workflow";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atom";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error to load editor" />;
};


export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data } = useSusupenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom)

  const [nodes, setNodes] = useState<Node[]>(data?.nodes);
  const [edges, setEdges] = useState<Edge[]>(data?.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return <div className="size-full">

    <ReactFlow
    nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        // snapGrid={[10,10]}
        // snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        
    >
        <MiniMap/>
        <Background/> 
        <Controls/>
        <Panel position="top-right">
            <AddNodeButton/>
        </Panel>
    </ReactFlow>
  </div>;
};

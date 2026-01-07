import { Connection, Node } from "@prisma/client";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";
export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  //  if no connections return nodes as is it becuase they all independent

  if (connections.length < 1) return nodes;

  //   create edges array for TopoSort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  // Add nodes with no connections as self edges to ensure they are included

  const connectedNodesId = new Set<string>();
  for (const conn of connections) {
    connectedNodesId.add(conn.fromNodeId);
    connectedNodesId.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodesId.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // perform topological sort
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    // remove duplicates from self-edges
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }

  // Map sorted IDs back to nodes objects
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId(),
  });
};

import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  //  if no connections return nodes as is it becuase they all independent

  if (connections.length < 1) return nodes;

//   create edges for TopoSort
// const edges = connections.map((conn)=> [conn.fromNodeId, conn.toNodeId])
  return nodes
};

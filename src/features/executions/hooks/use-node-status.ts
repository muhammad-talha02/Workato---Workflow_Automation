import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useEffectEvent, useState } from "react";

interface UseNodeStatusOpitons {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  channel,
  nodeId,
  refreshToken,
  topic,
}: UseNodeStatusOpitons) => {
  const [status, setStatus] = useState<NodeStatus>("initial");
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  const updateStatus = useEffectEvent((msg: Realtime.Message) => {
    if (msg?.kind === "data") {
      setStatus(msg.data.status as NodeStatus);
    }
  });

  useEffect(() => {
    if (!data?.length) return;

    //Fint the latest message for the node

    const latestMessage = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === "channel" &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    updateStatus(latestMessage);
  }, [data, nodeId, topic, channel]);
  return status;
};

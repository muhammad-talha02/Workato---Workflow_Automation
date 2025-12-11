import { channel, topic } from "@inngest/realtime";
import { InngestChannels } from ".";

export const manualTriggerChannel = channel(
  InngestChannels.manualTriggerChannel
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

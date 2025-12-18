import { channel, topic } from "@inngest/realtime";
import { InngestChannels } from ".";

export const stripeTriggerChannel = channel(
  InngestChannels.stripeTriggerChannel
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

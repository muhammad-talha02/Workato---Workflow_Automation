import { channel, topic } from "@inngest/realtime";
import { InngestChannels } from ".";

export const googleFormTriggerChannel = channel(
  InngestChannels.googleFormTriggerChannel
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

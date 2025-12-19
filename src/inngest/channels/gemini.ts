import { channel, topic } from "@inngest/realtime";
import { InngestChannels } from ".";

export const geminiChannel = channel(
  InngestChannels.geminiChannel
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

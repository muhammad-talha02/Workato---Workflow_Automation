import { channel, topic } from "@inngest/realtime";
import { InngestChannels } from ".";

export const slackChannel = channel(
  InngestChannels.slackChannel
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

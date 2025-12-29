import { channel, topic } from "@inngest/realtime";
import { InngestChannels } from ".";

export const discordChannel = channel(
  InngestChannels.discordChannel
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "error" | "success";
  }>()
);

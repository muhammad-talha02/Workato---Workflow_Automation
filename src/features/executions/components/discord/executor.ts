import { NodeExecutor } from "@/features/executions/types";
import { discordChannel } from "@/inngest/channels/discord";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import ky from "ky";
Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);

  return safeString;
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    discordChannel().status({
      nodeId,
      status: "loading",
    })
  );

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-workflow", async () => {
      if (!data.variableName) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Discord node: Variable name is missing");
      }

      if (!data.webhookUrl) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Discord node: webhook Url  is missing");
      }

      if (!data.content) {
        await publish(
          discordChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Discord node: Message content is missing");
      }
      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });
      return {
        ...context,
        [data.variableName]: {
          discordMessageSent: content.slice(0, 2000),
          username
        },
      };
    });

    await publish(
      discordChannel().status({
        nodeId,
        status: "success",
      })
    );
    return result;
  } catch {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Hey Error in Discord Execution");
  }
};

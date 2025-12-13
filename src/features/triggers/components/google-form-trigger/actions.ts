"use server";

import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type GoogleFormlTriggerToken = Realtime.Token<
  typeof googleFormTriggerChannel,
  ["status"]
>;

export const fetchGoogleFormTriggerRealTimeToken =
  async (): Promise<GoogleFormlTriggerToken> => {
    const token = await getSubscriptionToken(inngest, {
      channel: googleFormTriggerChannel(),
      topics: ["status"],
    });
    return token;
  };

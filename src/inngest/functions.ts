import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "./client";

const google = createGoogleGenerativeAI();
export const helloWorld = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap(
      "gemini-generating-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistent",
        prompt: "what is 5 + 2",
      }
    );

    return steps
  }
);

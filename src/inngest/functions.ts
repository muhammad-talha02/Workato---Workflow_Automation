import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";

const google = createGoogleGenerativeAI();
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "worflows/execute.workflow" },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

    const nodes = await step.run("prepare worflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return workflow.nodes;
    });

    return { nodes };
  }
);

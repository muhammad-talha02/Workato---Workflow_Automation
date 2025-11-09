import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "new@tte.com",
      },
    });
    return { success: true };
  }),
  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({name:"execute/ai"})
    return {success:true, message:"Job Queued"}
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

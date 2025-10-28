import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';
export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .query(({ctx}) => {
      return prisma.account.findMany({
        where:{accountId:ctx.auth.user.id}
      })
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
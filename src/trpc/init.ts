import { getAuthSession } from '@/lib/better-auth/auth-utils';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ctx, next})=>{
const session = await getAuthSession()

if(!session){
  throw new TRPCError({
    code:"UNAUTHORIZED",
    message:"You are not authroized bro"
  })
}
  return next({ctx:{...ctx,auth:session}})
});
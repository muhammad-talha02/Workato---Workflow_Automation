import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premuimProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";
import z from "zod";
export const workflowsRouter = createTRPCRouter({
  create: premuimProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: { userId: ctx.auth.user.id, id: input.id },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.auth.user.id },
      });

      // Transaction to ensure conistency
      return await prisma.$transaction(async (tx) => {
        // Delete existing nodes and connections (cascade deletes connections)
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        // Create new nodes
        await tx.node.createMany({
          data: nodes.map((x) => ({
            id: x.id,
            workflowId: id,
            name: x.type || "unknown",
            type: x.type as NodeType,
            position: x.position,
            data: x.data || [],
          })),
        });

        // Create Connections
        await tx.connection.createMany({
          data: edges.map((x) => ({
            workflowId: id,
            fromNodeId: x.source,
            toNodeId: x.target,
            fromOutput: x.sourceHandle || "main",
            toInput: x.targetHandle || "main",
          })),
        });

        // Update workflow's updatedAt Timestamps
        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });
        return workflow;
      });
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: { name: input.name },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
        include: { nodes: true, connections: true },
      });

      // Transform server nodes into react-flow nodes
      const nodes: Node[] = workflow?.nodes?.map((x) => ({
        id: x.id,
        type: x.type,
        position: x.position as { x: number; y: number },
        data: (x.data as Record<string, unknown>) || {},
      }));
      // Transform server connections into react-flow edges
      const edges: Edge[] = workflow?.connections?.map((x) => ({
        id: x.id,
        source: x.fromNodeId,
        target: x.toNodeId,
        sourceHandle: x.fromOutput,
        targetHandle: x.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});

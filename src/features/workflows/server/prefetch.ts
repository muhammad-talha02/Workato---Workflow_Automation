import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflow.getMany>

// Prefetch All Worflows 

export const prefetchWorkflows = (params:Input) =>{
    return prefetch(trpc.workflow.getMany.queryOptions(params))
}

// Prefetch Single Worflow

export const prefetchWorkflow = (id:string) =>{
    return prefetch(trpc.workflow.getOne.queryOptions({id}))
}
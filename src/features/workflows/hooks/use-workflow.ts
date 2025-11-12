import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useSusupenseWorkflows = ()=>{
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflow.getMany.queryOptions())

}
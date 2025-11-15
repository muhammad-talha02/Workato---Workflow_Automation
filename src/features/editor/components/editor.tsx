"use client"

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSusupenseWorkflow } from "@/features/workflows/hooks/use-workflow"


export const EditorLoading = ()=>{
    return <LoadingView message="Loading editor..."/>
}

export const EditorError = ()=>{
    return <ErrorView message="Error to load editor"/>
}

export const Editor = ({workflowId}:{workflowId:string})=>{
const{data} = useSusupenseWorkflow(workflowId)

return (
    <p>{JSON.stringify(data, null ,2)}</p>
)
}
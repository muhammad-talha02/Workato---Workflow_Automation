
'use client'
import { Button } from "@/components/ui/button";
import { requiredAuth } from "@/lib/better-auth/auth-utils";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { authClient } from "@/lib/better-auth/auth-client";

const Page =   () => {
//  await requiredAuth()
const trpc = useTRPC()
const queryClient = useQueryClient()
 const {data} = useQuery(trpc.getWorkflows.queryOptions())
 const createWorkflow = useMutation(trpc.createWorkflow.mutationOptions({
  onSuccess:()=>{
queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
  }
 }))
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {/* {JSON.stringify(session)} */}
     <h1>
       Proected Routee
      </h1> <br />
      {JSON.stringify(data, null, 2)}
      <Button disabled={createWorkflow.isPending} onClick={()=> createWorkflow.mutate()}>Create</Button>
      {/* <Button onClick={async ()=>await auth.api.signOut()}>Logout</Button> */}
    </div>
  );
};

export default Page;

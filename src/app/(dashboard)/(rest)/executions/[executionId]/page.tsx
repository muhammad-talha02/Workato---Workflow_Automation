import { requiredAuth } from "@/lib/better-auth/auth-utils"

interface PageProps {
   params: Promise<{executionId:string}>
}

const Page = async ({params}:PageProps) => {
      await requiredAuth()
  
    const {executionId} = await params
  return (
    <div>Execution Id: {executionId}</div>
  )
}

export default Page
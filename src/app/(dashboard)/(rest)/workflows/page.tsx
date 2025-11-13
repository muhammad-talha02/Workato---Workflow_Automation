import { WorflowsList, WorkflowsContainer } from "@/features/workflows/components/worflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requiredAuth } from "@/lib/better-auth/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams :Promise<SearchParams>
}
const Page = async ({searchParams}:Props) => {
  await requiredAuth();
  
  const params = await workflowsParamsLoader(searchParams)
  prefetchWorkflows(params);
  return (
    <WorkflowsContainer>

    <HydrateClient>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={"Loading..."}>
          <WorflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </WorkflowsContainer>
  );
};

export default Page;

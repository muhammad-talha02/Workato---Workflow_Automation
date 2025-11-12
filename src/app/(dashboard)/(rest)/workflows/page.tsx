import { WorflowsList, WorkflowsContainer } from "@/features/workflows/components/worflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requiredAuth } from "@/lib/better-auth/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
  await requiredAuth();
  prefetchWorkflows();
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

import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";

type HttpRequestData = {
  body?:string,
  endpoint?:string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for http request

  if(!data.endpoint){
    throw new NonRetriableError("HTTP request node: Endpoint is missing")
  }
  const result = await step.run("http-request", async () => context);

  // TODO: Publish "Success" state for http request
  return result;
};

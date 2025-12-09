import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { Options } from "ky";
type HttpRequestData = {
  variableName?: string;
  body?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for http request

  if (!data.endpoint) {
    throw new NonRetriableError("HTTP request node: Endpoint is missing");
  }

  if (!data.variableName) {
    throw new NonRetriableError("Varibale name not configured");
  }
  const result = await step.run("http-request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: Options = { method };

    if (["PUT", "PATCH", "POST"].includes(method)) {
      if (data.body) {
        options.body = data.body;
        options.headers = {
          "Content-Type": "application/json",
        };
      }
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json().catch(() => response.text())
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    // Fallback to redirect httpResponsefor backward compatibility
    return {
      ...context,
      ...responsePayload,
    };
  });

  // TODO: Publish "Success" state for http request

  return result;
};

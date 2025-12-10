import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { Options } from "ky";
import Handlebars from "handlebars"

Handlebars.registerHelper("json", (context)=> {
  const stringified = JSON.stringify(context, null,2)
  const safeString = new Handlebars.SafeString(stringified)

  return safeString

})

type HttpRequestData = {
  variableName: string;
  body?: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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
    throw new NonRetriableError("HTTP request node: Varibale name not configured");
  }

  if (!data.method) {
    throw new NonRetriableError("HTTP request node: Method not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint =Handlebars.compile(data.endpoint)(context)
    console.log({endpoint})
    const method = data.method;

    const options: Options = { method };

    if (["PUT", "PATCH", "POST"].includes(method)) {
      if (data.body) {
        const resolved = Handlebars.compile(data.body || "{}")(context)
        console.log({resolved})
        JSON.parse(resolved)
        options.body = resolved;
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

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    

  });

  // TODO: Publish "Success" state for http request

  return result;
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  variableName: z.string().min(1, {message:"Variable name is required"}).regex(/^[A-Za-z_][A-Za-z0-9_]*$/, {message:"Varibale must start with a letter or underscore and contain only letters, numbers and underscores"}),
  endpoint: z.url({ message: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
  //TODO .refine()
});
export type HTTPRequestFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HTTPRequestFormValues) => void;
  defaultValues?: Partial<HTTPRequestFormValues>;
}

const HTTPRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<HTTPRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultValues?.endpoint || "",
      method: defaultValues?.method || "GET",
      body: defaultValues?.body || "",
      variableName:defaultValues?.variableName || ''
    },
  });
  const variableName = form.watch("variableName");
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  
  const handleSubmit = (values: HTTPRequestFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };
  
  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultValues?.endpoint || "",
        method: defaultValues?.method || "GET",
        body: defaultValues?.body || "",
        variableName:defaultValues?.variableName || ''
      });
    }
  }, [open, defaultValues, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure setting for the HTTP Request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
           <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="myApiCall"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Use this name to reference the result in other nodes:
                    {`{{${variableName || "myApiCall"}.httpResponse.data}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP method used for this request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users/{{httpResponseData.id}}"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Static URL or use {"{{variables}}"} for simple values or{" "}
                    {"{{json variables}}"} to stringyfy objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder={`{\n "userId":"{{httpResponseData.data.id}}", \n "name":"{{httpResponseData.data.name}}", \n "items":"{{httpResponseData.data.items}}", \n}`}
                        {...field}
                        className="min-h-[120px] font-mono text-sm"
                      />
                    </FormControl>

                    <FormDescription>
                      JSON with template variables. Use {"{{variables}}"} for
                      simple values or {"{{json variables}}"} to stringyfy
                      objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="mt-4">
              <Button type="submit">Save </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HTTPRequestDialog;

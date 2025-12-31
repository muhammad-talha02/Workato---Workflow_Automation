import { Button } from "@/components/ui/button";
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro",
];

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_][A-Za-z0-9_]*$/, {
      message:
        "Varibale must start with a letter or underscore and contain only letters, numbers and underscores",
    }),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Slack messages cannot exceed 2000 characters"),
  webhookUrl: z.string().min(1, { message: "Webhook url is required" }),
});
export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SlackFormValues) => void;
  defaultValues?: Partial<SlackFormValues>;
}

const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<SlackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || "",
      content: defaultValues?.content || "",
      webhookUrl: defaultValues?.webhookUrl || "",
    },
  });
  const variableName = form.watch("variableName");

  const handleSubmit = (values: SlackFormValues) => {
    console.log({ values });
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName || "",
        content: defaultValues?.content || "",
        webhookUrl: defaultValues?.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure the Slack webhook settings for this node.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4">
            <div className="space-y-8 max-h-[65dvh] overflow-auto px-1">
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>

                    <FormControl>
                      <Input placeholder="mySlack" {...field} />
                    </FormControl>

                    <FormDescription>
                      Use this name to reference the result in other nodes:
                      {`{{${variableName || "mySlack"}.aiResponse.data}}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Webhook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://slack.com/api/webhooks/..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Get this from Slack: Workspace Settings {"->"}{" "}
                        Workflows {"->"} Webhooks
                      </FormDescription>
                      <FormDescription>
                        Make sure You have {`"content"`} variable
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder={`Summary: {{myGemini.text}}`}
                        {...field}
                        className="min-h-[80px] font-mono text-sm"
                      />
                    </FormControl>

                    <FormDescription>
                      The message to send. Use {"{{variables}}"} for simple
                      values or {"{{json variables}}"} to stringyfy objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Save </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SlackDialog;

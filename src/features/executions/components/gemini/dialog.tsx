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
import { useCredentialsByType } from "@/features/credentials/hooks/use-credential";
import { CredentialType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
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
  model: z.enum(GEMINI_MODELS),
  systemPrompt: z.string().optional(),
  credentialId: z.string().min(1, "Credential is required"),
  userPrompt: z.string().min(1, { message: "User prompt is required" }),
});
export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const { data: credentials, isLoading } = useCredentialsByType(
    CredentialType.GEMINI
  );
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId: defaultValues?.credentialId || "",
      variableName: defaultValues?.variableName || "",
      model: defaultValues?.model || GEMINI_MODELS[0],
      systemPrompt: defaultValues?.systemPrompt || "",
      userPrompt: defaultValues?.userPrompt || "",
    },
  });
  const variableName = form.watch("variableName");

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        credentialId: defaultValues?.credentialId || "",
        variableName: defaultValues?.variableName || "",
        model: defaultValues?.model || GEMINI_MODELS[0],
        systemPrompt: defaultValues?.systemPrompt || "",
        userPrompt: defaultValues?.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and promopst for this node.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4">
            <div className="space-y-8 max-h-[65dvh] overflow-auto">
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>

                    <FormControl>
                      <Input placeholder="myGemini" {...field} />
                    </FormControl>

                    <FormDescription>
                      Use this name to reference the result in other nodes:
                      {`{{${variableName || "myGemini"}.aiResponse.data}}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credentialId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Gemini Credentials</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading || !credentials?.length}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a credential" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {credentials?.map((x) => (
                            <SelectItem key={x.id} value={x.id}>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={"/logos/gemini.svg"}
                                  alt={x.name}
                                  width={16}
                                  height={16}
                                />
                                {x.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt (optional)</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder={`You are a helpful assistant.`}
                        {...field}
                        className="min-h-[80px] font-mono text-sm"
                      />
                    </FormControl>

                    <FormDescription>
                      The prompt to send to the AI. Use {"{{variables}}"} for
                      simple values or {"{{json variables}}"} to stringyfy
                      objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Prompt</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder={`Summarise this text: {{json httpResponse.data}}`}
                        {...field}
                        className="min-h-[120px] font-mono text-sm"
                      />
                    </FormControl>

                    <FormDescription>
                      Set the behaviour of assistant. Use {"{{variables}}"} for
                      simple values or {"{{json variables}}"} to stringyfy
                      objects.
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

export default GeminiDialog;

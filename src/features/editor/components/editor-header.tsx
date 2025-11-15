"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2Icon, SaveIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  useSusupenseWorkflow,
  useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflow";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  return (
    <div className="ml-auto">
      <Button size={"sm"} onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSusupenseWorkflow(workflowId);
  const updateWorkflowName = useUpdateWorkflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(true);
      return;
    }

    // setIsEditing(false);
    try {
      await updateWorkflowName.mutateAsync({ id: workflow.id, name });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <>
        <Input
          disabled={updateWorkflowName.isPending}
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="h-7 w-auto min-w-[100px] px-2"
        />
        {updateWorkflowName.isPending && (
          <Loader2Icon className="size-4 text-primary animate-spin" />
        )}
      </>
    );
  }
  return (
    <BreadcrumbItem
      className="cursor-pointer hover:text-foreground transition-colors"
      onClick={() => setIsEditing(true)}
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href={"/workflows"}>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};
const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};

export default EditorHeader;
